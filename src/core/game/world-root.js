// serves as the "main" world for the CES game system
angular.module('game.world-root', ['ces'])
    .service('$rootWorld', [
        'World',
        function (World) {
            'use strict';

            // game instance
            var _world = new World();
            _world._timing = {}; // to hold a reference in the loop
            return _world;
        }
    ]);