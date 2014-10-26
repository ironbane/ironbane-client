angular.module('game.ui.play', [
    'ui.router'
])
    .config(function ($stateProvider) {
        $stateProvider.state('play', {
            templateUrl: 'game/ui/play/play.tpl.html',
            controller: function($scope) {

            }
        });
    });
