angular
    .module('game.ui.main-menu.level-select', [
        'ui.router'
    ])
    .config(function ($stateProvider) {
        'use strict';

        $stateProvider.state('main-menu.level-select', {
            templateUrl: 'game/ui/main-menu/level-select/level-select.tpl.html',
            controller: function ($scope, $state) {
                // TODO: use config files
                $scope.levels = [{
                    name: 'Ravenwood Village',
                    path: 'ravenwood-village'
                }, {
                    name: 'Obstacle Course',
                    path: 'obstacle-test-course-one'
                }];

                $scope.chooseLevel = function (level) {
                    $state.go('play', {
                        level: level.path
                    });
                };
            }
        });
    });
