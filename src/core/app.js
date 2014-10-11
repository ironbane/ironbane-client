angular.module('Ironbane.CharPreviewApp', [
    'game.game-loop',
    'game.world-root',
    'ces',
    'three',
    'components',
    'game.scripts',
    'engine.entity-builder'
])
    .run(function (System, CameraSystem, ModelSystem, $rootWorld, THREE, LightSystem, SpriteSystem, SceneSystem, ScriptSystem) {
        'use strict';

        // TODO: move to directive
        $rootWorld.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild($rootWorld.renderer.domElement);

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
    .run(function loadWorld(Entity, $components, $rootWorld, THREE, EntityBuilder) {
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
        cube.position.y = 3;
        $rootWorld.addEntity(cube);

        var player = EntityBuilder.build('Player', {
            position: [0, 0.5, -2],
            components: {
                sprite: {
                    texture: 'assets/images/characters/skin/2.png'
                },
                health: {
                    max: 5,
                    value: 5
                },
                // add a little personal torchlight
                light: {
                    type: 'PointLight',
                    distance: 1
                }
            }
        });
        $rootWorld.addEntity(player);

        var level = new Entity();
        level.addComponent($components.get('scene', {id: 'storage-room'}));
        level.addComponent($components.get('light', {
            type: 'AmbientLight',
            color: new THREE.Color( 0xffffff )
        }));
        $rootWorld.addEntity(level);
    })
    .controller('MainController', function ($scope, $rootWorld) {
        'use strict';

        $scope.title = 'Hello world!';

        $scope.timing = $rootWorld._timing;

        $scope.world = $rootWorld;
    });
