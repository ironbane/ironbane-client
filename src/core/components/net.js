angular.component('components.net', ['ces', 'game.game-socket'])
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
    .factory('NetSystem', function (System, $gameSocket) { // relying on $gameSocket too "game" specific?
        'use strict';

        var NetSystem = System.extend({
            init: function () {
                this._super();

                $gameSocket.on('sync', this.sync.bind(this));
            },
            sync: function (packet) {
                var ghosts = this.world.getEntities('ghost'),
                    packetIds = Object.keys(packet);

                ghosts.forEach(function(ghost) {
                    var ghostId = ghost.getComponent('ghost').id;

                    if(packetIds.indexOf(ghostId) >= 0) {
                        ghost.position.set(packet[ghostId][0], packet[ghostId][1], packet[ghostId][2]);
                    }
                });
            },
            update: function () {
                var world = this.world;
            }
        });

        return NetSystem;
    });
