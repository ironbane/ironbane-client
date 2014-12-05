angular
    .module('engine.game-service', [
        'game.game-loop',
        'game.world-root',
        'components',
        'game.scripts',
        'game.prefabs',
        'engine.entity-builder',
        'engine.sound-system',
        'engine.input.input-system',
        'engine.level-loader'
    ])
    .service('GameService', function ($rootWorld, CameraSystem, ModelSystem,
        LightSystem, SpriteSystem, QuadSystem, HelperSystem, SceneSystem, ScriptSystem,
        SoundSystem, InputSystem, RigidBodySystem, CollisionReporterSystem, WieldItemSystem, NetSystem,
        EntityBuilder, $gameSocket, $log, LevelLoader, ProcTreeSystem) {

        'use strict';

        var createPlayer = function (data) {
            // TODO: move this to more specific player creation service method
            var player = EntityBuilder.build('Player', {
                rotation: data.rotation,
                position: data.position,
                components: {
                    ghost: {
                        id: data._id,
                        player: true // this so we don't sync up TODO: don't ghost player
                    },
                    quad: {
                        transparent: true,
                        texture: 'assets/images/characters/skin/2.png'
                    },
                    rigidBody: {
                        shape: {
                            type: 'capsule',
                            width: 0.5,
                            height: 1.0,
                            depth: 0.5,
                            radius: 0.5

                            // type: 'sphere',
                            // radius: 0.5
                        },
                        mass: 1,
                        friction: 0.0,
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
                    light: {
                        type: 'PointLight',
                        color: 0xffffff,
                        distance: 5
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
                            '/scripts/built-in/sprite-sheet.js',
                        ]
                    }
                }
            });
            $rootWorld.addEntity(player);
        };

        this.start = function (options) {
            options.offline = !!options.offline;

            $log.log('game service start!', options);

            // ALL these systems have to load before other entities
            // they don't load stuff after the fact...
            // TODO: fix that
            $rootWorld.addSystem(new SceneSystem());
            if (!options.offline) {
                $rootWorld.addSystem(new NetSystem(), 'net');
            }
            $rootWorld.addSystem(new InputSystem(), 'input');
            $rootWorld.addSystem(new SoundSystem(), 'sound');
            $rootWorld.addSystem(new ScriptSystem(), 'scripts');
            $rootWorld.addSystem(new ProcTreeSystem(), 'proctree');
            $rootWorld.addSystem(new SpriteSystem());
            $rootWorld.addSystem(new ModelSystem());
            $rootWorld.addSystem(new LightSystem());
            $rootWorld.addSystem(new QuadSystem());
            $rootWorld.addSystem(new RigidBodySystem());
            $rootWorld.addSystem(new CollisionReporterSystem());
            $rootWorld.addSystem(new HelperSystem());
            $rootWorld.addSystem(new WieldItemSystem());
            // NOTE: this should be the LAST system as it does rendering!!
            $rootWorld.addSystem(new CameraSystem(), 'camera');

            if (!options.offline) {
                $log.log('online mode!!!');
                $gameSocket.connect(options.server, options.level);

                $gameSocket.on('spawn', function (data) {
                    $log.log('spawn', data);

                    createPlayer(data);
                });
            } else {
                $log.log('offline mode!');
                createPlayer({
                    _id: 'abc123',
                    position: [22, 25, -10],
                    rotation: [0, Math.PI - 0.4, 0]
                });
            }

            LevelLoader.load(options.level).then(function () {
                if (!options.offline) {
                    // after the level and whatnot is loaded, request a player spawn
                    $gameSocket.emit('request spawn');
                }
            }, function (err) {
                $log.warn('error loading level: ', err);
            });
        };
    });
