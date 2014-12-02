angular
    .module('game.ui.play', [
        'ui.router',
        'engine.game-service'
    ])
    .config(function ($stateProvider) {
        $stateProvider.state('play', {
            url: '/play/:mode/:level',
            templateUrl: 'game/ui/play/play.tpl.html',
            resolve: {
                // pass thru injection for onEnter/onExit events
                GameService: function (GameService) {
                    return GameService;
                },
                level: function ($stateParams, $log) {
                    return $stateParams.level || 'obstacle-test-course-one'; // TODO: set a default in constants or something
                },
                mode: function ($stateParams) {
                    return $stateParams.mode || 'online';
                }
            },
            onEnter: function (GameService, level, mode) {
                var opts = {
                    level: level,
                    offline: mode !== 'online', // TODO: use local storage instead?
                    server: null // TODO: pull from server-select
                };
                GameService.start(opts);
            },
            onExit: function (GameService) {
                // TODO: shut down world
            }
        });
    });
