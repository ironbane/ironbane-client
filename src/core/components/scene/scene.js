angular.module('components.scene.scene', ['ces', 'three', 'engine.entity-builder'])
    .config(function ($componentsProvider) {
        'use strict';

        $componentsProvider.addComponentData({
            'scene': {
                'path': ''
            }
        });
    })
    .factory('SceneSystem', function (System, THREE, $http, TextureLoader, EntityBuilder) {
        'use strict';

        var SceneSystem = System.extend({
            addedToWorld: function (world) {
                var sys = this;

                sys._super(world);

                world.entityAdded('scene').add(function (entity) {
                    sys.onEntityAdded(entity);
                });
            },
            update: function () {

            },
            onEntityAdded: function (entity) {
                var component = entity.getComponent('scene');

                // these are clara.io exports
                var loader = new THREE.ObjectLoader();

                var meshTask = $http.get('assets/scene/' + component.id + '/ib-world.json')
                    .success(function (data) {
                        // THREE does not store material names/metadata when it recreates the materials
                        // so we need to store them here and then load the material maps ourselves

                        component.scene = loader.parse(data);

                        var originalMats = data.materials[0].materials;

                        for (var i = 0; i < originalMats.length; i++) {

                            if (originalMats[i].name) {

                                var texName = originalMats[i].name.split('.')[0];

                                var texture = THREE.ImageUtils.loadTexture('assets/scene/' + component.id + '/' + texName + '.png');
                                texture.magFilter = THREE.NearestFilter;
                                texture.minFilter = THREE.LinearMipMapLinearFilter;
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.wrapT = THREE.RepeatWrapping;

                                component.scene.material.materials[i].map = texture;
                                component.scene.material.materials[i].needsUpdate = true;
                            }
                        }

                        component.scene.material.needsUpdate = true;

                        entity.add(component.scene);
                    });

                var entitiesTask = $http.get('assets/scene/' + component.id + '/ib-entities.json')
                    .then(function(response) {
                        var entities = EntityBuilder.load(response.data);

                        entity.add(entities);
                    });
            },
            onEntityRemoved: function (entity) {
                // TODO
            }
        });

        return SceneSystem;
    });
