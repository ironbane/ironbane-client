// serves as the "main" world for the CES game system
angular.module('game.world-root', ['ces', 'three'])
    .service('$rootWorld', function (World, THREE) {
        'use strict';

        // game instance
        var _world = new World();

        _world._timing = {}; // to hold a reference in the loop

        _world.renderer = new THREE.WebGLRenderer();
        _world.scene = new THREE.Scene();

        var oldAddEntity = _world.addEntity;
        _world.addEntity = function (entity) {
            oldAddEntity.call(_world, entity);

            _world.scene.add(entity);
        };

        var oldRemoveEntity = _world.removeEntity;
        _world.removeEntity = function (entity) {
            oldRemoveEntity.call(_world, entity);

            _world.scene.remove(entity);
        };

        return _world;
    });
