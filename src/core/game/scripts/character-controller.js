angular.module('game.scripts.character-controller', ['components.script'])
    .run(function ($log, ScriptBank, IbConfig) {
        'use strict';

        var moveSpeed = 10;
        var rotateSpeed = 3;

        var bind = function (scope, fn) {
            return function () {
                fn.apply(scope, arguments);
            };
        };

        var CharacterControllerScript = function (entity, world) {
            var me = this;

            this.entity = entity;
            this.world = world;



            // var input = this.world.getSystem('input');
            // input.keyboard.registerCombo({
            //     keys: 'up',
            //     on_keydown: function () {
            //         entity.translateZ( moveSpeed * currentDt );
            //     }
            // });

            me.moveForward = false;
            me.moveBackward = false;
            me.moveLeft = false;
            me.moveRight = false;

            me.rotateLeft = false;
            me.rotateRight = false;

            IbConfig.get('domElement').addEventListener( 'keydown', bind(this, this.onKeyDown), false );
            IbConfig.get('domElement').addEventListener( 'keyup', bind(this, this.onKeyUp), false );
        };

        CharacterControllerScript.prototype.onKeyDown = function ( event ) {

            switch( event.keyCode ) {

                case 38: /*up*/
                case 87: /*W*/ this.moveForward = true; break;

                case 37: /*left*/
                case 65: /*A*/ this.moveLeft = true; break;

                case 40: /*down*/
                case 83: /*S*/ this.moveBackward = true; break;

                case 39: /*right*/
                case 68: /*D*/ this.moveRight = true; break;

                case 82: /*R*/ this.moveUp = true; break;
                case 70: /*F*/ this.moveDown = true; break;

                case 81: /*Q*/ this.rotateLeft = true; break;
                case 69: /*Q*/ this.rotateRight = true; break;

            }

        };

        CharacterControllerScript.prototype.onKeyUp = function ( event ) {

            switch( event.keyCode ) {

                case 38: /*up*/
                case 87: /*W*/ this.moveForward = false; break;

                case 37: /*left*/
                case 65: /*A*/ this.moveLeft = false; break;

                case 40: /*down*/
                case 83: /*S*/ this.moveBackward = false; break;

                case 39: /*right*/
                case 68: /*D*/ this.moveRight = false; break;

                case 82: /*R*/ this.moveUp = false; break;
                case 70: /*F*/ this.moveDown = false; break;

                case 81: /*Q*/ this.rotateLeft = false; break;
                case 69: /*Q*/ this.rotateRight = false; break;

            }

        };

        CharacterControllerScript.prototype.destroy = function () {
            // prolly don't want to reset all input all the time...
            this.world.getSystem('input').keyboard.reset();
        };

        CharacterControllerScript.prototype.update = function (dt, elapsed, timestamp) {

            // this script should be attached to an entity with a camera component....
            // var cameraComponent = this.entity.getComponent('camera');



            // if (!cameraComponent) {
            //     // throw error?weqq2hh
            //     return;
            // }

            // console.log(this.moveForward);

            if (this.moveForward) {
                this.entity.translateZ( -moveSpeed * dt );
            }
            if (this.moveBackward) {
                this.entity.translateZ( moveSpeed * dt );
            }
            if (this.moveLeft) {
                this.entity.rotateY( rotateSpeed * dt );
            }
            if (this.moveRight) {
                this.entity.rotateY( -rotateSpeed * dt );
            }

            if (this.rotateLeft) {
                this.entity.translateX( -moveSpeed * dt );
            }
            if (this.rotateRight) {
                this.entity.translateX( moveSpeed * dt );
            }
            // if (this.rotateRight) {
            //     this.entity.translateX( moveSpeed * dt );
            // }


            // cameraComponent.camera.position.set(Math.cos(timestamp / 1000) * 10, 20, Math.sin(timestamp / 1000) * 15);
            // cameraComponent.camera.lookAt(new THREE.Vector3(0, 0, 0));
        };

        ScriptBank.add('/scripts/built-in/character-controller.js', CharacterControllerScript);
    });
