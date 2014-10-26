angular.module('game.ui', [
    'ui.router',
    'game.ui.play'
])
.run(function($state) {
    'use strict';

    // for now just force "play" state
    $state.go('play');
});
