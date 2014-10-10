angular.module('Ironbane.CharPreviewApp', [
    'game.game-loop',
    'game.world-root',
    'ces',
    'three',
    'components.scene.camera',
    'components.scene.model',
    'components.scene.light',
    'components.scene.sprite',
    'components.scene.scene',
    'components.script',
    'game.scripts'
])
    .run(function (System, CameraSystem, ModelSystem, $rootWorld, THREE, LightSystem, SpriteSystem, SceneSystem, ScriptSystem) {
        'use strict';

        // TODO: move to directive
        $rootWorld.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild($rootWorld.renderer.domElement);

        var AutoPanSystem = System.extend({
            update: function(dt, elapsed, timestamp) {
                var cams = this.world.getEntities('camera');

                var mainCamera = cams[0].getComponent('camera').camera;

                mainCamera.position.set(Math.cos(timestamp/1000)*7, 17, Math.sin(timestamp/1000)*15);
                mainCamera.lookAt(new THREE.Vector3(0, 0, 0));
            }
        });
        //$rootWorld.addSystem(new AutoPanSystem());


        // DEBUG editor mode?
        var grid = new THREE.GridHelper(100, 1);
        $rootWorld.scene.add(grid);

        $rootWorld.addSystem(new ScriptSystem());

        $rootWorld.addSystem(new SceneSystem());
        $rootWorld.addSystem(new SpriteSystem());
        $rootWorld.addSystem(new ModelSystem());
        $rootWorld.addSystem(new LightSystem());
        // NOTE: this should be the LAST system as it does rendering!!
        $rootWorld.addSystem(new CameraSystem());
    })
    .run(function loadWorld(Entity, $components, $rootWorld, THREE) {
        'use strict';

        var cameraEntity = new Entity();
        cameraEntity.addComponent($components.get('camera'));
        cameraEntity.addComponent($components.get('script', {
            scripts: [
                '/scripts/built-in/camera-pan.js'
            ]
        }));
        $rootWorld.addEntity(cameraEntity);

        var cube = new Entity();
        cube.name = 'Cubey-Doobey-Doo';
        cube.addComponent($components.get('model'));
        cube.addComponent($components.get('script', {
            scripts: [
                'assets/scripts/test.js'
            ]
        }));
        $rootWorld.addEntity(cube);

        var light = new Entity();
        light.addComponent($components.get('light'));
        light.position.set(20, 20, 20);
        $rootWorld.addEntity(light);

        var sprite = new Entity();
        sprite.name = 'Player';
        sprite.addComponent($components.get('sprite', {texture: 'assets/images/characters/skin/2.png'}));
        sprite.position.y = 0.5;
        sprite.position.z = -2;
        $rootWorld.addEntity(sprite);

        var level = new Entity();
        level.addComponent($components.get('scene', {path: 'assets/scene/storage_room/storage-room.json'}));
        $rootWorld.addEntity(level);
    })
    .controller('MainController', function ($scope, $rootWorld) {
        'use strict';

        $scope.title = 'Hello world!';

        $scope.timing = $rootWorld._timing;

        $scope.world = $rootWorld;
    });