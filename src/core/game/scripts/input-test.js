angular.module('game.scripts.input-test', ['components.script'])
    .run(function ($log, ScriptBank) {
        'use strict';

        var TestScript = function (entity, world) {
            this.entity = entity;
            this.world = world;

            $log.debug('InputTest', world._systemRegistry, world.getSystem('input'));

            var input = this.world.getSystem('input');
            input.keyboard.simpleCombo('w', function () {
                $log.debug('w pressed');
            });
        };

        TestScript.prototype.destroy = function () {
            // clear out combo registers
            $log.debug('InputTest destroy');

            // prolly don't want to reset all input all the time...
            this.world.getSystem('input').keyboard.reset();
        };

        TestScript.prototype.update = function (dt, elapsed, timestamp) {

        };

        ScriptBank.add('/scripts/built-in/input-test.js', TestScript);
    });
