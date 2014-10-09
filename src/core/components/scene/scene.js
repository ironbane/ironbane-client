angular.module('components.scene.scene', ['ces', 'three'])
    .config(function ($componentsProvider) {
        'use strict';

        $componentsProvider.addComponentData({
            'scene': {
                'path': ''
            }
        });
    })
    .factory('SceneSystem', function (System, THREE) {
        'use strict';

        var SceneSystem = System.extend({
            addedToWorld: function (world) {
                var sys = this;

                sys._super(world);

                world.entityAdded('scene').add(function (entity) {
                    sys.onEntityAdded(entity);
                });
            },
            update: function () {},
            onEntityAdded: function (entity) {
                var component = entity.getComponent('scene');

                // these are clara.io exports
                var loader = new THREE.ObjectLoader();
                // TODO: cache?
                loader.load(component.path, function(obj) {
                    component.scene = obj;
                    entity.add(component.scene);
                });
            },
            onEntityRemoved: function (entity) {
                // TODO
            }
        });

        return SceneSystem;
    });