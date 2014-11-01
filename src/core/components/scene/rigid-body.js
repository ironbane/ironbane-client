angular.module('components.scene.rigid-body', ['ces', 'three', 'ammo'])
    .config(function ($componentsProvider) {
        'use strict';

        $componentsProvider.addComponentData({
            'rigidBody': {
                shape: 'sphere',
                sphere: {
                    diameter: 1
                }
            }
        });
    })
    .factory('RigidBodySystem', function (System, THREE, Ammo, $rootWorld) {
        'use strict';

        var activationStates = {
            RIGIDBODY_ACTIVE_TAG: 1,
            RIGIDBODY_ISLAND_SLEEPING: 2,
            RIGIDBODY_WANTS_DEACTIVATION: 3,
            RIGIDBODY_DISABLE_DEACTIVATION: 4,
            RIGIDBODY_DISABLE_SIMULATION: 5,
        };

        var btVec3 = new Ammo.btVector3(0, 0, 0);
        var btQuat = new Ammo.btQuaternion(0, 0, 0, 1);


        var RigidBodySystem = System.extend({
            addedToWorld: function (world) {
                var sys = this;

                sys._super(world);

                world.entityAdded('rigidBody').add(function (entity) {
                    var rigidBodyData = entity.getComponent('rigidBody');

                    var shape = new Ammo.btSphereShape(rigidBodyData.sphere.diameter);

                    var mass = 1;

                    shape.calculateLocalInertia(mass, btVec3);

                    btVec3.setY(50);
                    var btTransform = new Ammo.btTransform(btQuat, btVec3);
                    var state = new Ammo.btDefaultMotionState(btTransform);

                    btVec3.setY(0);
                    var rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(mass, state, shape, btVec3);
                    var rigidBody = new Ammo.btRigidBody( rigidBodyInfo );

                    rigidBodyData.rigidBody = rigidBody;

                    $rootWorld.physicsWorld.addRigidBody( rigidBody );

                    // rigidBody.forceActivationState(activationStates.RIGIDBODY_ACTIVE_TAG);

                });

            },
            update: function (dt) {
                var world = this.world;
                var rigidBodies = world.getEntities('rigidBody');

                rigidBodies.forEach(function (entity) {

                    var rigidBodyComponent = entity.getComponent('rigidBody');

                    if (rigidBodyComponent) {
                        var trans = new Ammo.btTransform();
                        rigidBodyComponent.rigidBody.getMotionState().getWorldTransform(trans);
                        // console.log(trans.getOrigin().x());
                        console.log(trans.getOrigin().y());
                        // console.log(trans.getOrigin().z());
                        var origin = trans.getOrigin();

                        entity.position.setX(origin.x());
                        entity.position.setY(origin.y());
                        entity.position.setZ(origin.z());
                    }

                });
                // console.log(dt);
            }
        });

        return RigidBodySystem;
    });
