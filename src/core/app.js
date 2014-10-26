angular.module('Ironbane.CharPreviewApp', [
    'game.game-loop',
    'game.world-root',
    'ces',
    'three',
    'components',
    'game.scripts',
    'engine.entity-builder',
    'engine.sound-system',
    'engine.ib-config',
    'engine.input.input-system'
])
    .config(function(SoundSystemProvider) {
        // define all of the sounds & music for the game
        SoundSystemProvider.setAudioLibraryData({
            theme: {
                path: 'assets/music/ib_theme',
                volume: 0.55,
                loop: true,
                type: 'music'
            }
        });
    })
    .config(function(IbConfigProvider) {
        // Used for input events
        IbConfigProvider.set('domElement', document);
    })
    .run(function (System, CameraSystem, ModelSystem, $rootWorld, THREE, LightSystem, SpriteSystem, QuadSystem, SceneSystem, ScriptSystem, SoundSystem, InputSystem) {
        'use strict';

        // TODO: move to directive
        $rootWorld.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild($rootWorld.renderer.domElement);
        $rootWorld.renderer.setClearColorHex(0xd3fff8);

        window.addEventListener('resize', function () {
            $rootWorld.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false );

        // DEBUG editor mode?
        var grid = new THREE.GridHelper(100, 1);
        $rootWorld.scene.add(grid);

        $rootWorld.addSystem(new InputSystem(), 'input');
        $rootWorld.addSystem(new SoundSystem());
        $rootWorld.addSystem(new ScriptSystem());
        $rootWorld.addSystem(new SceneSystem());
        $rootWorld.addSystem(new SpriteSystem());
        $rootWorld.addSystem(new ModelSystem());
        $rootWorld.addSystem(new LightSystem());
        $rootWorld.addSystem(new QuadSystem());
        // NOTE: this should be the LAST system as it does rendering!!
        $rootWorld.addSystem(new CameraSystem());
    })
    .run(function loadWorld($log, Entity, $components, $rootWorld, THREE, EntityBuilder) {
        'use strict';

        // var musicEntity = EntityBuilder.build('MusicPlayer', {
        //     components: {
        //         sound: {
        //             asset: 'theme',
        //             loop: true
        //         }
        //     }
        // });
        // $log.debug('musicEntity', musicEntity);
        // $rootWorld.addEntity(musicEntity);

        var cube = EntityBuilder.build('Cubey-Doobey-Doo', {
            position: [0, 3, 0],
            components: {
                model: {
                    //default
                },
                script: {
                    scripts: [
                        'assets/scripts/test.js',

                        // Disabled as it interferes with regular DOM keyevent listeners
                        // '/scripts/built-in/input-test.js'
                    ]
                }
            }
        });
        // this tests that a child added prior to the parent being added to the world
        // is still registered by the entity list
        /*for (var x = 0; x < 10; x++) {
            cube.add(EntityBuilder.build('Test Light ' + x, {
                position: [x * 2, 5, 0],
                components: {
                    light: {
                        type: 'PointLight'
                    }
                }
            }));
        }*/
        //cube.add(testChild);
        $rootWorld.addEntity(cube);

        var player = EntityBuilder.build('Player', {
            position: [0, 0.5, -18],
            components: {
                sprite: {
                    texture: 'assets/images/characters/skin/2.png'
                },
                health: {
                    max: 5,
                    value: 5
                },
                camera: {},
                script: {
                    scripts: [
                        '/scripts/built-in/character-controller.js',
                        '/scripts/built-in/character-multicam.js',
                    ]
                },
                // add a little personal torchlight
                light: {
                    type: 'PointLight',
                    distance: 1
                }
            }
        });
        $rootWorld.addEntity(player);

        var bunny = EntityBuilder.build('Bunny', {
            position: [0, 0.5, -20],
            components: {
                quad: {
                    texture: 'assets/images/characters/skin/29.png'
                },
                script: {
                    scripts: [
                        '/scripts/built-in/look-at-camera.js',
                    ]
                },
                health: {
                    max: 5,
                    value: 5
                }
            }
        });
        $rootWorld.addEntity(bunny);

        var level = EntityBuilder.build('TestLevel', {
            components: {
                scene: {
                    id: 'dev-zone'
                },
                light: {
                    type: 'AmbientLight',
                    color: 0x333333
                }
            }
        });
        $rootWorld.addEntity(level);
    })
    .controller('MainController', function ($scope, $rootWorld) {
        'use strict';

        $scope.title = 'Hello world!';

        $scope.timing = $rootWorld._timing;

        $scope.world = $rootWorld;
    });
