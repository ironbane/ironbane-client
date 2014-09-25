angular.module('Ironbane.CharPreviewApp', [
    'game.game-loop',
    'game.world-root',
    'ces-sugar',
    'engine.three-adapter',
    'engine.base-components'
])
    .run([
        'ThreeAdapter',
        '$rootWorld',
        function (ThreeAdapter, $rootWorld) {
            'use strict';

            $rootWorld.addSystem(new ThreeAdapter());
        }
    ])
    .run([
        '$systems',
        'System',
        '$rootWorld',
        function ($systems, System, $rootWorld) {
            'use strict';

            // just a test system to do stupid stuff
            var RotateSystem = function () {
                System.call(this);
            };

            RotateSystem.prototype = Object.create(System.prototype);
            RotateSystem.prototype.constructor = RotateSystem;

            RotateSystem.prototype.update = function (dt) {
                var ents = this.world.getEntities('transform');

                ents.forEach(function(entity) {
                    var xform = entity.getComponent('transform');

                    xform.rotation.x += 0.0021 * dt;
                    xform.rotation.y += 0.0001 * dt;
                });
            };

            $rootWorld.addSystem(new RotateSystem());
        }
    ])
    .run([
        'Entity',
        '$components',
        '$rootWorld',
        function (Entity, $components, $rootWorld) {
            'use strict';

            // super simple test
            var foo = new Entity();
            var xform = $components.getComponent('transform');
            var box = $components.getComponent('mesh');
            foo.addComponent(xform);
            foo.addComponent(box);
            xform.position.x = 2.5;
            xform.scale.y = 2;

            $rootWorld.addEntity(foo);
        }
    ])
    .controller('MainController', ['$scope', '$rootWorld',
        function ($scope, $rootWorld) {
            'use strict';

            $scope.title = 'Hello world!';

            $scope.timing = $rootWorld._timing;

            $scope.world = $rootWorld;

        }
    ]);