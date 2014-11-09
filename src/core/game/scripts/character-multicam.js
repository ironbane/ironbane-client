angular.module('game.scripts.character-multicam', ['components.script'])
    .run(function ($log, ScriptBank, IbConfig, THREE) {
        'use strict';

        // The multicam gives you first and third person in one script
        // When in third person, you control your character with the arrow/wasd keys only
        // In first person, you control it with the mouse and arrow/wasd
        // Using the 'V' key you can switch between these views. (later add mousewheel support)

        var camModeEnum = {
            FirstPerson: 1,
            FirstPersonToThirdPerson: 2,
            ThirdPerson: 3,
            ThirdPersonToFirstPerson: 4
        };

        var camMode = camModeEnum.ThirdPerson;

        var lat = 0;
        var lon = -90;
        var phi = 0;
        var theta = 0;

        var targetPosition = new THREE.Vector3( 0, 0, 0 );

        var mouseSpeed = 0.004;

        var PI_2 = Math.PI / 2;

        var bind = function (scope, fn) {
            return function () {
                fn.apply(scope, arguments);
            };
        };

        var thirdPersonCam;
        var firstPersonCam;

        var cameraThirdPersonLookAtTarget = new THREE.Vector3();

        var MultiCamScript = function (entity, world) {
            var me = this;

            this.entity = entity;
            this.world = world;

            var cameraComponent = this.entity.getComponent('camera');

            if (cameraComponent) {
                cameraComponent.camera.rotation.set( 0, 0, 0 );
            }

            thirdPersonCam = cameraComponent.camera.clone();

            // TODO: move this event listener some place else
            // maybe to constructor of Camera somehow?
            // it's annoying that the clone() doesn't do this
            window.addEventListener('resize', function () {
                thirdPersonCam.aspect = window.innerWidth / window.innerHeight;
                thirdPersonCam.updateProjectionMatrix();
            }, false );

            entity.parent.add(thirdPersonCam);

            firstPersonCam = cameraComponent.camera;
            firstPersonCam.position.set(0, 1.5, 4);
            cameraComponent.camera = thirdPersonCam;

            IbConfig.get('domElement').addEventListener( 'mousemove', bind(this, this.onMouseMove), false );
        };

        MultiCamScript.prototype.onMouseMove = function ( event ) {
            var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
            var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

            lon += movementX;
            lat -= movementY;

            lat = Math.max( - 85, Math.min( 85, lat ) );
            phi = ( 90 - lat ) * Math.PI / 180;
            theta = lon * Math.PI / 180;

            var position = this.entity.position;

            targetPosition.x = position.x + 100 * Math.sin( phi ) * Math.cos( theta );
            targetPosition.y = position.y + 100 * Math.cos( phi );
            targetPosition.z = position.z + 100 * Math.sin( phi ) * Math.sin( theta );


        };

        MultiCamScript.prototype.update = function (dt, elapsed, timestamp) {
            var cameraComponent = this.entity.getComponent('camera');

            if (cameraComponent) {
                if (camMode === camModeEnum.FirstPerson) {
                    cameraComponent.camera.lookAt(targetPosition);

                    this.entity.quaternion.copy(cameraComponent.camera.quaternion);
                    cameraComponent.camera.quaternion.copy(new THREE.Quaternion());
                }
                if (camMode === camModeEnum.ThirdPerson) {
                    var worldPos = new THREE.Vector3();
                    worldPos.setFromMatrixPosition(firstPersonCam.matrixWorld);

                    var v1 = new THREE.Vector3(0, 1, -1);
                    v1.applyQuaternion( this.entity.quaternion );

                    thirdPersonCam.position.lerp(worldPos, dt*5);
                    cameraThirdPersonLookAtTarget.lerp(this.entity.position.clone().add(v1), dt*5);
                    thirdPersonCam.lookAt(cameraThirdPersonLookAtTarget);
                }
            }
        };

        ScriptBank.add('/scripts/built-in/character-multicam.js', MultiCamScript);
    });
