// a "shadow" is a billboard that doesn't look up
angular.module('components.scene.shadow', ['ces', 'three', 'engine.texture-loader'])
    .config(function ($componentsProvider) {
        'use strict';

        $componentsProvider.addComponentData({
            'shadow': {

            }
        });
    })
    .factory('ShadowSystem', function (System, THREE, TextureLoader, $log) {
        'use strict';

        var SHADOW_PATH = 'assets/images/core/shadow.png';

        var ShadowSystem = System.extend({
            addedToWorld: function (world) {
                var sys = this;

                sys._super(world);

                world.entityAdded('shadow').add(function (entity) {
                    var shadowData = entity.getComponent('shadow'),
                        shadow;

                    var planeGeo = new THREE.PlaneGeometry(1.0, 1.0, 1, 1);

                    shadow = new THREE.Mesh(planeGeo, new THREE.MeshLambertMaterial());
                    shadow.material.side = THREE.DoubleSide;
                    shadow.geometry.dynamic = true;

                    TextureLoader.load(SHADOW_PATH)
                        .then(function (texture) {
                            // texture.needsUpdate = true;
                            shadow.material.map = texture;
                            shadow.material.needsUpdate = true;
                            shadow.geometry.buffersNeedUpdate = true;
                            shadow.geometry.uvsNeedUpdate = true;
                            shadow.material.transparent = true;
                        });

                    shadowData.shadow = shadow;

                    shadow.rotation.x = Math.PI / 2;

                    // It's not worth it to keep the shadow as a child of the original entity,
                    // because the only thing that needs to be sync'd is the position.
                    // It's hard to get the rotations and scaling right in terms of math (atleast for me)
                    // and probably also for CPU, so we just copy the position instead
                    // and set the parent to be the same as the entity's parent (usually the scene)
                    world.scene.add(shadow);
                });
            },
            update: function () {
                var world = this.world,
                    shadows = world.getEntities('shadow'),
                    entitiesWithCamera = this.world.getEntities('camera'),
                    activeCamera;

                if (entitiesWithCamera.length) {
                    // HACK: this might not be the active camera someday...
                    activeCamera = entitiesWithCamera[0].getComponent('camera').camera;
                }

                if (!activeCamera) {
                    //$log.warn('No camera to look at!');
                    return;
                }

                shadows.forEach(function (shadowEnt) {
                    var shadow = shadowEnt.getComponent('shadow').shadow;
                    shadow.position.copy(shadowEnt.position);

                    var camWorldPos = new THREE.Vector3();
                    camWorldPos.setFromMatrixPosition(activeCamera.matrixWorld);

                    // var rigidbodyWorld = world.getSystem('rigidbody');

                    // rigidbodyWorld.raycastAll(shadowEnt.position,
                    //     shadowEnt.position.clone().setY(shadowEnt.position.y-100),
                    //     function (result) {
                    //         debug.watch('raycast result', result.point);
                    //         // console.log(result);
                    //     });

                    // shadow.lookAt(camWorldPos, shadow.position, shadow.up);
                });
            }
        });

        return ShadowSystem;
    });
