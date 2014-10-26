angular.module('components.scene.rigid-body', ['ces', 'three', 'ammo'])
    .config(function ($componentsProvider) {
        'use strict';

        $componentsProvider.addComponentData({
            'rigidBody': {

            }
        });
    })
    .factory('RigidBodySystem', function (System, THREE, Ammo, $rootWorld) {
        'use strict';

        var RigidBodySystem = System.extend({
            addedToWorld: function (world) {
                var sys = this;

                sys._super(world);

                world.entityAdded('rigidBody').add(function (entity) {
                    var rigidBodyData = entity.getComponent('rigidBody');

                    var fallShape = new Ammo.btSphereShape(1);

                    var mass = 1;
                    var fallInertia = new Ammo.btVector3(0, 0, 0);
                    fallShape.calculateLocalInertia(mass, fallInertia);

                    var fallMotionState =
                        new Ammo.btDefaultMotionState(new Ammo.btTransform(new Ammo.btQuaternion(0, 0, 0, 1), new Ammo.btVector3(0, 50, 0)));

                    var rigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(0, fallMotionState, fallShape, new Ammo.btVector3(0, 0, 0));
                    var rigidBody = new Ammo.btRigidBody( rigidBodyInfo );

                    $rootWorld.physicsWorld.addRigidBody( rigidBody );

                    rigidBodyData.rigidBody = rigidBody;
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
                        console.log(trans.getOrigin().y());
                    }

                });
                // console.log(dt);
            }
        });

        return RigidBodySystem;
    });
