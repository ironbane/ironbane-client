angular
    .module('game.ui.chat', [
        'game.chat-socket'
    ])
    .directive('ibChat', function ($chatSocket) {
        return {
            restrict: 'E',
            templateUrl: 'game/ui/chat/chat.tpl.html',
            link: function (scope, el) {
                scope.chat = {
                    message: ''
                };

                scope.messages = [];

                scope.send = function () {
                    if(scope.chat.message.length === 0) {
                        return;
                    }

                    $chatSocket.emit('message', scope.chat.message);
                    scope.chat.message = '';
                };

                $chatSocket.on('message', function(msg) {
                    scope.messages.push(msg);
                });
            }
        };
    });
