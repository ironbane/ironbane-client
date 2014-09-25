angular.module('engine.three-adapter', ['ces', 'ces-sugar', 'three'])
    .factory('ThreeAdapter', [
        'THREE',
        '$components',
        'System',
        function (THREE, $components, System) {
            'use strict';

            var _links = {};

            var ThreeAdapter = function () {
                System.call(this);

                var viewWidth = window.innerWidth;
                var viewHeight = window.innerHeight - 5;

                this.renderer = new THREE.WebGLRenderer();
                this.renderer.setSize(viewWidth, viewHeight);
                this.camera = new THREE.PerspectiveCamera(70, viewWidth / viewHeight, 0.1, 4000);
                this.camera.position.z = 5;
                this.scene = new THREE.Scene();
            };

            ThreeAdapter.prototype = Object.create(System.prototype);
            ThreeAdapter.prototype.constructor = ThreeAdapter;

            function buildPrimitive(type) {
                var geometry;

                if (type === 'box') {
                    geometry = new THREE.BoxGeometry(1, 1, 1);
                }

                if (type === 'sphere') {
                    geometry = new THREE.SphereGeometry(1);
                }

                if (type === 'circle') {
                    geometry = new THREE.CircleGeometry(1);
                }

                if (type === 'cylinder') {
                    geometry = new THREE.CylinderGeometry();
                }

                return new THREE.Mesh(geometry);
            }

            function getLinkedObj(entity) {
                var self = this;

                if (entity.hasComponent('three-link')) {
                    return _links[entity.getComponent('three-link').id];
                } else {
                    var obj = new THREE.Object3D();
                    var linkComponent = $components.getComponent('three-link', {
                        id: obj.uuid
                    });
                    entity.addComponent(linkComponent);
                    _links[obj.uuid] = obj;
                    self.scene.add(obj);

                    return obj;
                }
            }

            ThreeAdapter.prototype.addedToWorld = function (world) {
                var self = this;

                self.world = world;

                // TODO: move to directive?
                document.body.appendChild(this.renderer.domElement);

                // basically entities with a transform are 'physical' in the 3d world
                world.entityAdded('transform').add(function (entity) {
                    var obj = getLinkedObj.call(self, entity),
                        xform = entity.getComponent('transform');

                    entity.posObserver = function (changes) {
                        var changed = changes[0].object;
                        obj.position.set(changed.x, changed.y, changed.z);
                    };
                    Object.observe(xform.position, entity.posObserver);

                    entity.scaleObserver = function (changes) {
                        var changed = changes[0].object;
                        obj.scale.set(changed.x, changed.y, changed.z);
                    };
                    Object.observe(xform.scale, entity.scaleObserver);

                    entity.rotationObserver = function (changes) {
                        var changed = changes[0].object;
                        obj.rotation.set(changed.x, changed.y, changed.z);
                    };
                    Object.observe(xform.rotation, entity.rotationObserver);
                });

                world.entityAdded('transform', 'mesh').add(function (entity) {
                    var obj = getLinkedObj.call(self, entity);
                    var meshData = entity.getComponent('mesh');

                    if (meshData !== 'model') {
                        obj.add(buildPrimitive(meshData.geometryType));
                    }
                });

                world.entityRemoved('transform').add(function (entity) {
                    var xform = entity.getComponent('transform');

                    // remove all observers
                    Object.unobserve(xform.position, entity.posObserver);
                    Object.unobserve(xform.scale, entity.scaleObserver);
                    Object.unobserve(xform.rotation, entity.rotationObserver);
                    // remove object from scene
                    // remove linked object reference
                });
            };

            // todo: handle remove

            ThreeAdapter.prototype.update = function () {
                this.renderer.render(this.scene, this.camera);
            };

            return ThreeAdapter;
        }
    ]);