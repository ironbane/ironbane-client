angular
    .module('components.procgen.tree', [
        'ces',
        'three',
        'engine.procgen.proctree'
    ])
    .config(function ($componentsProvider) {
        'use strict';

        $componentsProvider.addComponentData({
            'proctree': {
                'seed': 61,
                'segments': 10,
                'levels': 5,
                'vMultiplier': 0.66,
                'twigScale': 0.47,
                'initalBranchLength': 0.5,
                'lengthFalloffFactor': 0.85,
                'lengthFalloffPower': 0.99,
                'clumpMax': 0.449,
                'clumpMin': 0.404,
                'branchFactor': 3.75,
                'dropAmount': 0.07,
                'growAmount': -0.005,
                'sweepAmount': 0.01,
                'maxRadius': 0.269,
                'climbRate': 0.626,
                'trunkKink': 0.108,
                'treeSteps': 4,
                'taperRate': 0.876,
                'radiusFalloffRate': 0.66,
                'twistRate': 2.7,
                'trunkLength': 1.55,
                'trunkMaterial': 'TrunkType2',
                'twigMaterial': 'BranchType5'
            }
        });
    })
    .factory('ProcTreeSystem', function (THREE, System, ProcTree) {
        var ProcTreeSystem = System.extend({
            addedToWorld: function (world) {
                var sys = this;

                sys._super(world);

                world.entityAdded('proctree').add(function (entity) {
                    var component = entity.getComponent('proctree');
                    var tree = new ProcTree(component);
                    var model = {
                        'metadata': {
                            'formatVersion': 3.1,
                            'generatedBy': 'bb3d2proctree',
                            'vertices': 0,
                            'faces': 0,
                            'description': 'Auto-generated from proctree.'
                        },
                        'materials': [{ // just testing...
                            'diffuse': 20000
                        }],
                        'colors': [0xff00ff, 0xff0000] // just testing
                    };

                    model.vertices = ProcTree.flattenArray(tree.verts);
                    model.normals = ProcTree.flattenArray(tree.normals);
                    model.uvs = [ProcTree.flattenArray(tree.UV)];

                    model.faces = [];
                    for (var i = 0; i < tree.faces.length; i++) {
                        var face = tree.faces[i];
                        model.faces.push(0);
                        model.faces.push(face[0]); // v1
                        model.faces.push(face[1]); // v2
                        model.faces.push(face[2]); // v3
                    }

                    var loader = new THREE.JSONLoader();
                    var meshData = loader.parse(model);
                    var mesh = new THREE.Mesh(meshData.geometry, new THREE.MeshBasicMaterial({
                        color: 0xFF0000
                    }));

                    component.mesh = mesh; // store reference in the component
                    entity.add(mesh);

                });
            },
            update: function () {} // override default, even tho isn't used...
        });

        return ProcTreeSystem;
    });
