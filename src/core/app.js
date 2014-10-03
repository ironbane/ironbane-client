angular.module('Ironbane.CharPreviewApp', [
    'game.game-loop',
    'game.world-root',
    'ces',
    'three',
    'components.scene.camera',
    'components.scene.model',
    'components.scene.light'
])
    .run(function (CameraSystem, ModelSystem, $rootWorld, THREE, LightSystem) {
        'use strict';

        // TODO: move to directive
        $rootWorld.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild($rootWorld.renderer.domElement);


        // DEBUG editor mode?
        var grid = new THREE.GridHelper(100, 1);
        $rootWorld.scene.add(grid);


        $rootWorld.addSystem(new ModelSystem());
        $rootWorld.addSystem(new LightSystem());
        // NOTE: this should be the LAST system as it does rendering!!
        $rootWorld.addSystem(new CameraSystem());
    })
    .run(function loadWorld(Entity, $components, $rootWorld, THREE) {
        'use strict';

        var cameraEntity = new Entity();
        cameraEntity.addComponent($components.get('camera'));
        $rootWorld.addEntity(cameraEntity);
        var cam = cameraEntity.getComponent('camera').camera;
        cam.position.set(7, 12, 15);
        cam.lookAt(new THREE.Vector3(0, 0, 0));

        var cube = new Entity();
        cube.addComponent($components.get('model'));
        $rootWorld.addEntity(cube);

        var light = new Entity();
        light.addComponent($components.get('light'));
        light.position.set(20, 20, 20);
        $rootWorld.addEntity(light);
    })
    .controller('MainController', function ($scope, $rootWorld) {
        'use strict';

        $scope.title = 'Hello world!';

        $scope.timing = $rootWorld._timing;

        $scope.world = $rootWorld;
    });