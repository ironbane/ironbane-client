angular.module('game.scripts.character-controller', ['components.script'])
    .run(function ($log, ScriptBank) {
        'use strict';

        var moveSpeed = 10;
        var rotateSpeed = 3;

        var CharacterControllerScript = function (entity, world) {
            this.entity = entity;
            this.world = world;

            this.moveForward = false;
            this.moveBackward = false;
            this.moveLeft = false;
            this.moveRight = false;

            this.rotateLeft = false;
            this.rotateRight = false;
        };

        CharacterControllerScript.prototype.update = function (dt, elapsed, timestamp) {

            var input = this.world.getSystem('input'), // should cache this during init?
                leftStick = input.virtualGamepad.leftThumbstick;

            // reset these every frame
            this.moveForward = false;
            this.moveBackward = false;
            this.moveLeft = false;
            this.moveRight = false;
            this.rotateLeft = false;
            this.rotateRight = false;

            // virtual gamepad (touch ipad) controls
            if (leftStick) {
                if (leftStick.delta.y < 0) {
                    this.moveForward = true;
                }
                if (leftStick.delta.y > 0) {
                    this.moveBackward = true;
                }

                if (leftStick.delta.x < 0) {
                    this.moveLeft = true;
                }
                if (leftStick.delta.x > 0) {
                    this.moveRight = true;
                }
            }

            // keyboard controls
            if (input.keyboard.isDown(input.KEYS.W) || input.keyboard.isDown(input.KEYS.UP)) {
                this.moveForward = true;
            }

            if (input.keyboard.isDown(input.KEYS.S) || input.keyboard.isDown(input.KEYS.DOWN)) {
                this.moveBackward = true;
            }

            if (input.keyboard.isDown(input.KEYS.A) || input.keyboard.isDown(input.KEYS.LEFT)) {
                this.moveLeft = true;
            }

            if (input.keyboard.isDown(input.KEYS.D) || input.keyboard.isDown(input.KEYS.RIGHT)) {
                this.moveRight = true;
            }

            if (input.keyboard.isDown(input.KEYS.Q)) {
                this.rotateLeft = true;
            }

            if (input.keyboard.isDown(input.KEYS.E)) {
                this.rotateRight = true;
            }

            // react to changes
            if (this.moveForward) {
                this.entity.translateZ(-moveSpeed * dt);
            }
            if (this.moveBackward) {
                this.entity.translateZ(moveSpeed * dt);
            }
            if (this.moveLeft) {
                this.entity.rotateY(rotateSpeed * dt);
            }
            if (this.moveRight) {
                this.entity.rotateY(-rotateSpeed * dt);
            }

            if (this.rotateLeft) {
                this.entity.translateX(-moveSpeed * dt);
            }
            if (this.rotateRight) {
                this.entity.translateX(moveSpeed * dt);
            }


            // cameraComponent.camera.position.set(Math.cos(timestamp / 1000) * 10, 20, Math.sin(timestamp / 1000) * 15);
            // cameraComponent.camera.lookAt(new THREE.Vector3(0, 0, 0));
        };

        ScriptBank.add('/scripts/built-in/character-controller.js', CharacterControllerScript);
    });
