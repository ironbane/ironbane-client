angular
    .module('game.ui.main-menu.level-select', [
        'ui.router'
    ])
    .config(function ($stateProvider) {
        'use strict';

        $stateProvider.state('main-menu.level-select', {
            url: '/level-select/:mode',
            templateUrl: 'game/ui/main-menu/level-select/level-select.tpl.html',
            controller: function ($scope, $state, $log, $http) {
                // TODO: move to service?
                $http.get('assets/scene/scenes.json')
                    .then(function (response) {
                        $scope.levels = response.data;
                    });

                $scope.chooseLevel = function (level) {
                    $log.debug('chooseLevel', level);
                    $state.go('play', {
                        'level': level.path,
                        'mode': $state.params.mode || 'online'
                    });
                };
            }
        });
    });
