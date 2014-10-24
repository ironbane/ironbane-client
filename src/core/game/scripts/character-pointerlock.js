angular.module('game.scripts.character-pointerlock', ['components.script'])
    .run(function ($log, ScriptBank, IbConfig, THREE) {
        'use strict';

        var pitchObject = new THREE.Object3D();
        var yawObject = new THREE.Object3D();

        var PI_2 = Math.PI / 2;

        var bind = function (scope, fn) {
            return function () {
                fn.apply(scope, arguments);
            };
        };

        var PointerLockScript = function (entity, world) {
            var me = this;

            this.entity = entity;
            this.world = world;

            var cameraComponent = this.entity.getComponent('camera');

            if (cameraComponent) {
                cameraComponent.camera.rotation.set( 0, 0, 0 );

                pitchObject.add( cameraComponent.camera );

                yawObject.position.y = 1;
                yawObject.add( pitchObject );
            }

            this.entity.add(yawObject);

            IbConfig.get('domElement').addEventListener( 'mousemove', bind(this, this.onMouseMove), false );
        };

        PointerLockScript.prototype.onMouseMove = function ( event ) {
            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            // console.log(movementX, movementY);

            yawObject.rotation.y -= movementX * 0.002;
            pitchObject.rotation.x -= movementY * 0.002;

            pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

            // console.log(pitchObject.rotation);
        };

        ScriptBank.add('/scripts/built-in/character-pointerlock.js', PointerLockScript);
    });
