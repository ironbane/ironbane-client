angular.module('engine.debugger', ['engine.ib-config', 'three', 'engine.util'])
    .service('Debugger', function (IbConfig, THREE, Util) {
        'use strict';


        var watched = [];
        var domElement = IbConfig.get('debugDomElementId');

        this.watch = function (label, variable) {
            watched.push({ label: label, variable: variable });
        };

        this.tick = function (dt) {

            if (!domElement) {
                return;
            }

            var text = '';

            watched.forEach(function (watch) {
                var info = watch.variable;

                if (watch.variable instanceof THREE.Vector3) {
                    info = 'x: ' + Util.roundNumber(watch.variable.x, 2) + ', y: ' + Util.roundNumber(watch.variable.y, 2) + ', z: ' + Util.roundNumber(watch.variable.z, 2);
                }

                text += watch.label + ': ' + info + '<br>';
            });

            document.getElementById(domElement).innerHTML = text;

            watched = [];
        };
    });
