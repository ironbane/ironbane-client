angular.module('game.scripts.look-at-camera', ['components.script', 'three'])
    .run(function (ScriptBank, THREE) {
        'use strict';

        var LookAtCameraScript = function (entity, world) {
            this.entity = entity;
            this.world = world;

            // It's not worth it to keep the quad as a child of the original entity,
            // because the only thing that needs to be syned is the position.
            // It's hard to get the rotations and scaling right in terms of math (atleast for me)
            // and probably also for CPU, so we just copy the position instead
            // and set the parent to be the same as the entity's parent (usually the scene)
            var quadComponent = this.entity.getComponent('quad');

            if (!quadComponent) {
                return;
            }

            this.entity.parent.add(quadComponent.quad);
        };

        LookAtCameraScript.prototype.update = function (dt, elapsed, timestamp) {

            var quadComponent = this.entity.getComponent('quad');

            if (!quadComponent) {
                return;
            }

            var entitiesWithCamera = this.world.getEntities('camera');

            if (entitiesWithCamera.length) {
                var activeCamera = entitiesWithCamera[0].getComponent('camera').camera;

                var quad = quadComponent.quad;

                quad.position.copy(this.entity.position);

                var parent = this.entity.parent;
                var camWorldPos = new THREE.Vector3();
                camWorldPos.setFromMatrixPosition(activeCamera.matrixWorld);

                quad.lookAt( camWorldPos, quad.position, quad.up );
            }

        };

        ScriptBank.add('/scripts/built-in/look-at-camera.js', LookAtCameraScript);
    });
