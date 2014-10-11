angular.module('components.scene.scene', ['ces', 'three'])
    .config(function ($componentsProvider) {
        'use strict';

        $componentsProvider.addComponentData({
            'scene': {
                'path': ''
            }
        });
    })
    .factory('SceneSystem', function (System, THREE, $http, TextureLoader) {
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

                $http.get('assets/scene/' + component.id + '/ib-world.json')
                    .success(function (data) {

                        // THREE does not store material names/metadata when it recreates the materials
                        // so we need to store them here and then load the material maps ourselves

                        component.scene = loader.parse(data);

                        var originalMats = data.materials[0].materials;
                        var newMats = component.scene.children[0].material.materials;

                        for (var i = 0; i < originalMats.length; i++) {

                            if (originalMats[i].name) {

                                // (function(originalMat, newMat) {
                                //     var texName = originalMat.name.split('.')[0];

                                //     TextureLoader.load('assets/scene/' + component.id + '/' + texName + '.png')
                                //     .then(function (texture) {

                                //         // texture.magFilter = THREE.NearestFilter;
                                //         // texture.minFilter = THREE.NearestMipMapLinearFilter;
                                //         // texture.wrapS = THREE.RepeatWrapping;
                                //         // texture.wrapT = THREE.RepeatWrapping;

                                //         newMat.map = texture;
                                //         newMat.needsUpdate = true;
                                //         newMat.color.setHex(0xffffff);
                                //         newMat.ambient.setHex(0xffffff);
                                //     });

                                // })(originalMats[i], newMats[i]);

                                var texName = originalMats[i].name.split('.')[0];

                                var texture = THREE.ImageUtils.loadTexture('assets/scene/' + component.id + '/' + texName + '.png');
                                texture.magFilter = THREE.NearestFilter;
                                texture.minFilter = THREE.LinearMipMapLinearFilter;
                                texture.wrapS = THREE.RepeatWrapping;
                                texture.wrapT = THREE.RepeatWrapping;

                                newMats[i].map = texture;
                                newMats[i].needsUpdate = true;
                                newMats[i].color.setHex(0xffffff);
                                newMats[i].ambient.setHex(0xffffff);
                            }
                        }

                        component.scene.children[0].material.materials = newMats;
                        component.scene.children[0].material.needsUpdate = true;

                        entity.add(component.scene);
                    });
            },
            onEntityRemoved: function (entity) {
                // TODO
            }
        });

        return SceneSystem;
    });
