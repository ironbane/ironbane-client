angular
    .module('game.ui.chat', [])
    .directive('ibChat', function () {
        return {
            restrict: 'E',
            templateUrl: 'game/ui/chat/chat.tpl.html',
            link: function (scope, el) {
                scope.messages = [];
                scope.send = function() {
                    scope.messages.push(scope.chat.message);
                };
            }
        };
    });
