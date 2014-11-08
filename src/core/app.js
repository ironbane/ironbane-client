angular.module('Ironbane', [
    'angus.templates.app',
    'game.ui',
    'game.game-loop',
    'game.world-root',
    'ces',
    'three',
    'ammo',
    'ammo.physics-world',
    'components',
    'game.scripts',
    'engine.entity-builder',
    'engine.sound-system',
    'engine.ib-config',
    'engine.input.input-system',
    'engine.util',
    'game.game-socket'
])
    .config(function(SoundSystemProvider, $gameSocketProvider) {
        $gameSocketProvider.setUrl('http://localhost:3000');

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
    .run(function($gameSocket, $log) {

        // event handlers are promise based and can be added any time
        $gameSocket.on('chat message', function(msg) {
            $log.log('got socket msg!', msg);
        });
    })
    .run(function (System, CameraSystem, ModelSystem, $rootWorld, THREE, LightSystem, SpriteSystem, QuadSystem, HelperSystem, SceneSystem, ScriptSystem, SoundSystem, InputSystem, RigidBodySystem, CollisionReporterSystem) {
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
        $rootWorld.addSystem(new RigidBodySystem());
        $rootWorld.addSystem(new CollisionReporterSystem());
        $rootWorld.addSystem(new HelperSystem());
        // NOTE: this should be the LAST system as it does rendering!!
        $rootWorld.addSystem(new CameraSystem());
    })
    .run(function loadWorld($log, Entity, $components, $rootWorld, THREE, EntityBuilder, Util) {
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
                        {src: 'assets/scripts/test.js', params: {speed: 0.5}}

                        // Disabled as it interferes with regular DOM keyevent listeners
                        // '/scripts/built-in/input-test.js'
                    ]
                }
            }
        });
        $rootWorld.addEntity(cube);

        var player = EntityBuilder.build('Player', {
            position: [-50, 30.0, -50],
            components: {
                quad: {
                    transparent: true,
                    texture: 'assets/images/characters/skin/2.png'
                },
                rigidBody: {
                    shape: {
                        type: 'sphere',
                        // height: 1,
                        radius: 0.5
                    },
                    mass: 1,
                    friction: 0,
                    restitution: 0,
                    allowSleep: false,
                    lock: {
                        position: {
                            x: false,
                            y: false,
                            z: false
                        },
                        rotation: {
                            x: true,
                            y: true,
                            z: true
                        }
                    }
                },
                collisionReporter: {

                },
                helper: {
                    line: true
                },
                health: {
                    max: 5,
                    value: 5
                },
                camera: {
                    aspectRatio: $rootWorld.renderer.domElement.width / $rootWorld.renderer.domElement.height
                },
                script: {
                    scripts: [
                        '/scripts/built-in/character-controller.js',
                        '/scripts/built-in/character-multicam.js',
                        '/scripts/built-in/look-at-camera.js',
                        '/scripts/built-in/sprite-sheet.js',
                    ]
                }
            }
        });
        $rootWorld.addEntity(player);

        for (var i = 0; i < 10; i++) {
            (function (i) {

                setTimeout(function () {
                    console.log('Spawning ' + i);
                    var bunny = EntityBuilder.build('Bunny', {
                        position: [Util.getRandomInt(-55, -45), 100, Util.getRandomInt(-55, -45)],
                        components: {
                            quad: {
                                transparent: true,
                                texture: 'assets/images/characters/skin/29.png'
                            },
                            rigidBody: {
                                shape: {
                                    type: 'sphere',
                                    // height: 1,
                                    radius: 0.5
                                },
                                mass: 1,
                                friction: 0,
                                restitution: 0,
                                allowSleep: false,
                                lock: {
                                    position: {
                                        x: false,
                                        y: false,
                                        z: false
                                    },
                                    rotation: {
                                        x: true,
                                        y: true,
                                        z: true
                                    }
                                }
                            },
                            helper: {
                                line: true
                            },
                            script: {
                                scripts: [
                                    '/scripts/built-in/look-at-camera.js',
                                    '/scripts/built-in/sprite-sheet.js',
                                ]
                            },
                            health: {
                                max: 5,
                                value: 5
                            }
                        }
                    });
                    $rootWorld.addEntity(bunny);
                }, i * 500);
            })(i);
        }

        var level = EntityBuilder.build('TestLevel', {
            components: {
                scene: {
                    id: 'ravenwood-village'
                },
                rigidBody: {
                    shape: {
                        type: 'concave'
                    },
                    mass: 0
                },
                light: {
                    type: 'AmbientLight',
                    color: 0x333333
                }
            }
        });
        $rootWorld.addEntity(level);
    });
