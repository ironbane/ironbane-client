angular
    .module('game.ui.play', [
        'ui.router',
        'engine.game-service'
    ])
    .config(function ($stateProvider) {
        $stateProvider.state('play', {
            url: '/play/:level',
            templateUrl: 'game/ui/play/play.tpl.html',
            resolve: {
                // pass thru injection for onEnter/onExit events
                GameService: function (GameService) {
                    return GameService;
                },
                level: function ($stateParams, $log) {
                    $log.debug('state!!', $stateParams);
                    return $stateParams.level || 'obstacle-test-course-one';
                }
            },
            onEnter: function (GameService, level) {
                GameService.start(level);
            },
            onExit: function (GameService) {
                // TODO: shut down world
            }
        });
    });
