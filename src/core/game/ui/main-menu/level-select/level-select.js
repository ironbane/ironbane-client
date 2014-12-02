angular
    .module('game.ui.main-menu.level-select', [
        'ui.router'
    ])
    .config(function ($stateProvider) {
        'use strict';

        $stateProvider.state('main-menu.level-select', {
            templateUrl: 'game/ui/main-menu/level-select/level-select.tpl.html',
            controller: function ($scope, $state, $log) {
                // TODO: use config files
                $scope.levels = [{
                    name: 'Ravenwood Village',
                    path: 'ravenwood-village'
                }, {
                    name: 'Obstacle Course',
                    path: 'obstacle-test-course-one'
                }, {
                    name: 'Classic Dungeon',
                    path: 'classic-dungeon'
                }];

                $scope.chooseLevel = function (level) {
                    $log.debug('chooseLevel', level);
                    $state.go('play', {
                        'level': level.path,
                        'mode': 'online'
                    });
                    window.state = $state;
                };
            }
        });
    });
