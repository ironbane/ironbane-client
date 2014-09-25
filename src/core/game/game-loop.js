angular.module('game.game-loop', ['game.world-root'])
    .run([
        '$rootWorld',
        '$window',
        function ($rootWorld, $window) {
            'use strict';

            var startTime = $window.performance.now();
            var lastTimestamp = startTime;
            var _timing = $rootWorld._timing;

            function onRequestedFrame() {
                var timestamp = $window.performance.now();

                $window.requestAnimationFrame(onRequestedFrame);

                _timing.timestamp = timestamp;
                _timing.elapsed = timestamp - startTime;
                _timing.frameTime = timestamp - lastTimestamp;

                $rootWorld.update(_timing.frameTime, _timing.elapsed, _timing.timestamp);

                lastTimestamp = timestamp;
            }

            window.requestAnimationFrame(onRequestedFrame);
        }
    ]);