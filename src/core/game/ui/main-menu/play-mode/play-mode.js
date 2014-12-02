angular
    .module('game.ui.main-menu.play-mode', [
        'ui.router'
    ])
    .config(function ($stateProvider) {
        'use strict';

        $stateProvider.state('main-menu.play-mode', {
            templateUrl: 'game/ui/main-menu/play-mode/play-mode.tpl.html',
            controller: function ($scope, $state) {
                $scope.playOnline = function() {
                    $state.go('^.server-select');
                };

                $scope.playOffline = function() {
                    $state.go('^.level-select');
                };
            }
        });
    });
