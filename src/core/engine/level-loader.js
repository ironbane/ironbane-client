angular
    .module('engine.level-loader', [
        'three',
        'engine.entity-builder',
        'engine.texture-loader',
        'game.world-root'
    ])
    .service('levelLoader', function ($rootWorld, THREE, $http, TextureLoader, EntityBuilder, $log, $q) {

        this.load = function (levelId) {
            // TODO: clear world out first?

            // these are clara.io exports
            var loader = new THREE.ObjectLoader(),
                meshTask,
                entitiesTask;

            // some levels are huge, try zip first
            meshTask = $http.get('assets/scene/' + levelId + '/ib-world.zip', {
                    responseType: 'arraybuffer'
                })
                .then(function (response) {
                    var zip = new JSZip(response.data);
                    var worldData = JSON.parse(zip.file('ib-world.json').asText());
                    $log.debug('worldData: ', worldData);
                    return worldData;
                }, function (err) {
                    // likely we don't have a zip file... try raw
                    return $http.get('assets/scene/' + levelId + '/ib-world.json')
                        .then(function (response) {
                            return response.data;
                        }); // TODO: handle errors here
                })
                .then(function (data) {
                    // THREE does not store material names/metadata when it recreates the materials
                    // so we need to store them here and then load the material maps ourselves

                    var scene = loader.parse(data);
                    var originalMats = data.materials[0].materials;

                    var loadTexture = function (texName, material, geometry) {
                        return TextureLoader.load('assets/scene/' + levelId + '/' + texName + '.png')
                            .then(function (texture) {
                                material.map = texture;
                                material.needsUpdate = true;
                                geometry.buffersNeedUpdate = true;
                                geometry.uvsNeedUpdate = true;
                            });
                    };

                    for (var i = 0; i < originalMats.length; i++) {
                        if (originalMats[i].name) {
                            var texName = originalMats[i].name.split('.')[0];
                            loadTexture(texName, scene.material.materials[i], scene.geometry);
                        }
                    }

                    scene.material.needsUpdate = true;

                    $rootWorld.add(scene);

                    return scene;
                });

            entitiesTask = $http.get('assets/scene/' + levelId + '/ib-entities.json')
                .then(function (response) {
                    var entities = EntityBuilder.load(response.data);

                    $log.log('scene loader ents: ', entities);

                    $rootWorld.add(entities);
                });

            return $q.all([meshTask, entitiesTask]);
        };

    });
