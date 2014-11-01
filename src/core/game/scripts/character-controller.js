angular.module('game.scripts.character-controller', ['components.script', 'three', 'ammo'])
    .run(function ($log, ScriptBank, THREE, Ammo) {
        'use strict';

        var moveSpeed = 10;
        var rotateSpeed = 3;

        var btVec3 = new Ammo.btVector3();

        var CharacterControllerScript = function (entity, world) {
            this.entity = entity;
            this.world = world;

            this.moveForward = false;
            this.moveBackward = false;
            this.rotateLeft = false;
            this.rotateRight = false;

            this.moveLeft = false;
            this.moveRight = false;
        };

        CharacterControllerScript.prototype.update = function (dt, elapsed, timestamp) {

            var input = this.world.getSystem('input'), // should cache this during init?
                leftStick = input.virtualGamepad.leftThumbstick;

            // reset these every frame
            this.moveForward = false;
            this.moveBackward = false;
            this.rotateLeft = false;
            this.rotateRight = false;
            this.moveLeft = false;
            this.moveRight = false;

            // virtual gamepad (touch ipad) controls
            if (leftStick) {
                if (leftStick.delta.y < 0) {
                    this.moveForward = true;
                }
                if (leftStick.delta.y > 0) {
                    this.moveBackward = true;
                }

                if (leftStick.delta.x < 0) {
                    this.rotateLeft = true;
                }
                if (leftStick.delta.x > 0) {
                    this.rotateRight = true;
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
                this.rotateLeft = true;
            }

            if (input.keyboard.isDown(input.KEYS.D) || input.keyboard.isDown(input.KEYS.RIGHT)) {
                this.rotateRight = true;
            }

            if (input.keyboard.isDown(input.KEYS.Q)) {
                this.moveLeft = true;
            }

            if (input.keyboard.isDown(input.KEYS.E)) {
                this.moveRight = true;
            }

            var inputVector = new THREE.Vector3();

            // react to changes
            if (this.moveForward) {
                inputVector.z -= 1;
            }
            if (this.moveBackward) {
                inputVector.z += 1;
            }
            if (this.moveLeft) {
                inputVector.x -= 1;
            }
            if (this.moveRight) {
                inputVector.x += 1;
            }

            // Make sure they can't gain extra speed if moving diagonally
            inputVector.normalize();

            var rigidBodyComponent = this.entity.getComponent('rigidBody');
            if (rigidBodyComponent) {

                // We need to rotate the vector ourselves
                var v1 = new THREE.Vector3();
                v1.copy( inputVector ).applyQuaternion( this.entity.quaternion );
                v1.multiplyScalar(moveSpeed);

                // this.entity.translateOnAxis(inputVector, moveSpeed * dt);
                btVec3.setValue(v1.x, v1.y, v1.z);
                rigidBodyComponent.rigidBody.setLinearVelocity(btVec3);
            }
            else {
                this.entity.translateOnAxis(inputVector, moveSpeed * dt);
            }


            if (this.rotateLeft) {
                this.entity.rotateY(rotateSpeed * dt);
            }
            if (this.rotateRight) {
                this.entity.rotateY(-rotateSpeed * dt);
            }
        };

        ScriptBank.add('/scripts/built-in/character-controller.js', CharacterControllerScript);
    });
