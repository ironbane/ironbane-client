angular.module('game.game-loop', ['game.world-root'])
    .run([
        '$rootWorld',
        '$window',
        function ($rootWorld, $window) {
            'use strict';

            var startTime = $window.performance.now() / 1000.0;
            var lastTimestamp = startTime;
            var _timing = $rootWorld._timing;

            function onRequestedFrame() {
                var timestamp = $window.performance.now() / 1000.0;

                $window.requestAnimationFrame(onRequestedFrame);

                _timing.timestamp = timestamp;
                _timing.elapsed = timestamp - startTime;
                _timing.frameTime = timestamp - lastTimestamp;

                _timing.frameTime = Math.min(_timing.frameTime, 0.3);

                $rootWorld.update(_timing.frameTime, _timing.elapsed, _timing.timestamp);

                lastTimestamp = timestamp;
            }

            window.requestAnimationFrame(onRequestedFrame);
        }
    ]);
