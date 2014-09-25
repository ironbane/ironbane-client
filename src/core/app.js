angular.module('Ironbane.CharPreviewApp', [
    'game.game-loop',
    'game.world-root',
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