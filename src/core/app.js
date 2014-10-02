angular.module('Ironbane.CharPreviewApp', [
    'game.game-loop',
    'game.world-root',
    'ces',
    'components.scene.camera'
])
    .run(function (CameraSystem, $rootWorld) {
        'use strict';

        // TODO: move to directive
        $rootWorld.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( $rootWorld.renderer.domElement );


        // NOTE: this should be the LAST system as it does rendering!!
        $rootWorld.addSystem(new CameraSystem());
    })
    .run(function loadWorld(Entity, $components, $rootWorld) {
        'use strict';

        var cameraEntity = new Entity();
        cameraEntity.addComponent($components.get('camera'));

        $rootWorld.addEntity(cameraEntity);
    })
    .controller('MainController', function ($scope, $rootWorld) {
        'use strict';

        $scope.title = 'Hello world!';

        $scope.timing = $rootWorld._timing;

        $scope.world = $rootWorld;
    });