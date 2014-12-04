angular
    .module('components.net', [
        'ces',
        'game.game-socket',
        'engine.entity-builder'
    ])
    .config(function ($componentsProvider) {
        'use strict';

        // Ghosting – The server keeps track of all the "true" objects in play,
        // and "Ghosts" or copies data for each of them to the Clients by using Scoping.
        // What this means the server has a master list of objects, and sends updated information
        // for them to a local copy of the object on the client.

        $componentsProvider.addComponentData({
            'ghost': {
                id: -1
            }
        });
    })
    .factory('NetSystem', function (System, $gameSocket, $log, EntityBuilder) { // relying on $gameSocket too "game" specific?
        'use strict';

        var NetSystem = System.extend({
            init: function () {
                this._super();

                $gameSocket.on('sync', this.sync.bind(this));
            },
            sync: function (data) {
                var world = this.world,
                    ghosts = world.getEntities('ghost');

                // TODO: move to prefab, support other types
                function buildPlayerGhost(data) {
                    var player = EntityBuilder.build('NetPlayer', {
                        rotation: data.rotation,
                        position: data.position,
                        components: {
                            ghost: {
                                id: data._id
                            },
                            quad: {
                                transparent: true,
                                texture: 'assets/images/characters/skin/2.png'
                            },
                            health: {
                                max: 5,
                                value: 5
                            },
                            script: {
                                scripts: [
                                    '/scripts/built-in/sprite-sheet.js',
                                ]
                            }
                        }
                    });

                    world.addEntity(player);
                }

                // first update the ones we already have
                angular.forEach(ghosts, function (ghost) {
                    var ghostComponent = ghost.getComponent('ghost');

                    for (var i = 0; i < data.length; i++) {
                        if (data[i]._id === ghostComponent.id) {
                            if (!ghostComponent.player) {
                                ghost.position.fromArray(data[i].position);
                                ghost.rotation.fromArray(data[i].rotation);
                            }
                            data[i].ghosted = true;
                            break;
                        }
                    }
                });

                // add new ones (the rest)
                angular.forEach(data, function (g) {
                    if (!g.ghosted) {
                        buildPlayerGhost(g);
                    }
                });

                // remove ones that have left
                var ids = _.pluck(data, '_id');
                for (var i = ghosts.length - 1; i > 0; i--) {
                    if (ids.indexOf(ghosts[i].getComponent('ghost').id) < 0) {
                        $log.log('dude dropped: ', ghosts[i], ids);
                        world.removeEntity(ghosts[i]);
                    }
                }
            },
            update: function () {
                $gameSocket.emit('sync');
            }
        });

        return NetSystem;
    });
