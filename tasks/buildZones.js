'use strict';


var THREE = require('three');

THREE.GeometryExporter = require('./exporters/GeometryExporter');
THREE.Geometry2Exporter = require('./exporters/Geometry2Exporter');
THREE.BufferGeometryExporter = require('./exporters/BufferGeometryExporter');
THREE.MaterialExporter = require('./exporters/MaterialExporter');
THREE.ObjectExporter = require('./exporters/ObjectExporter');

var fs = require('fs');
var path = require('path');
var AdmZip = require('adm-zip');
var walk = require('walkdir');
var mkdirp = require('mkdirp');
var Q = require('q');
var curl = require('curlrequest');
var _ = require('underscore');
var claraUser = require('../clara.json');

var claraOptions = function (url, encoding) {
    return {
        url: url,
        'user': claraUser.name + ':' + claraUser.apiKey,
        encoding: encoding
    };
};

module.exports = function (angus, gulp) {
    return function (done) {

        var exportClaraScenes = function () {
            curl.request(claraOptions('http://clara.io/api/users/nikke/scenes'), function (err, file) {
                var promises = [];

                var json = JSON.parse(file);

                json.models.forEach(function (model) {
                    var ibSceneId = model.name.toLowerCase().replace(/ /g, '-');
                    console.log(ibSceneId);
                    console.log(model.id);

                    promises.push(extractWorld(ibSceneId, model.id));
                });

                Q.all(promises).then(function () {
                    console.log('All done.');
                    done();
                });
            });
        };

        var extractWorld = function (ibSceneId, claraSceneId) {
            var deferred = Q.defer();

            curl.request(claraOptions('http://clara.io/api/scenes/' + claraSceneId + '/export/json?zip=true', null), function (err, file) {

                var zonePath = angus.appPath + '/src/assets/scene/' + ibSceneId;

                mkdirp.sync(zonePath);

                var zipFilepath = zonePath + '/clara-export.zip';

                fs.writeFile(zipFilepath, file, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        var zip = new AdmZip(zipFilepath);
                        zip.extractAllTo(zonePath, true);

                        walk(zonePath, function (filePath, stat) {
                            if (path.basename(filePath, '.json') === ibSceneId) {
                                filePath = filePath.replace(__dirname, '');

                                var claraExportFilepath = path.dirname(filePath) + '/clara-export.json';
                                var ibWorldFilepath = path.dirname(filePath) + '/ib-world.json';

                                fs.renameSync(filePath, claraExportFilepath);

                                var claraExportJson = require(claraExportFilepath);
                                var ibWorld = postProcessWorld(claraExportJson);
                                saveProcessedWorld(ibWorld, ibWorldFilepath, function () {
                                    deferred.resolve();
                                });
                            }
                        });
                    }
                });

            });

            return deferred.promise;
        };

        var postProcessWorld = function (json) {
            var loader = new THREE.ObjectLoader();

            var obj = loader.parse(json);

            var newWorld = new THREE.Object3D();

            var mergedMeshesGeometry = new THREE.Geometry();
            var mergedMaterialsCollection = [];

            var entitiesCollection = new THREE.Object3D();

            loopChildren(obj, function (child) {
                if (child.userData.entity) {
                    if (obj.userData.entity) {
                        // Only if the parent is an entity, we save the uuid
                        // Otherwise it would be no use since the parent will be merged into one world mesh
                        child.parentUuid = obj.uuid;
                    }
                    entitiesCollection.add(child);
                } else {
                    if (child.geometry) {

                        var clonedGeometry = child.geometry.clone();

                        child.updateMatrixWorld(true);

                        clonedGeometry.vertices.forEach(function (v) {
                            v.applyMatrix4(child.matrixWorld);
                        });

                        mergeMaterials(mergedMeshesGeometry, mergedMaterialsCollection, clonedGeometry, [child.material]);
                    }
                }
            });

            function mergeMaterials(geometry1, materials1, geometry2, materials2) {

                var matrix, matrixRotation,
                    vertexOffset = geometry1.vertices.length,
                    uvPosition = geometry1.faceVertexUvs[0].length,
                    vertices1 = geometry1.vertices,
                    vertices2 = geometry2.vertices,
                    faces1 = geometry1.faces,
                    faces2 = geometry2.faces,
                    uvs1 = geometry1.faceVertexUvs[0],
                    uvs2 = geometry2.faceVertexUvs[0];

                var geo1MaterialsMap = {};

                for (var i = 0; i < materials1.length; i++) {

                    var id = materials1[i].id;

                    geo1MaterialsMap[id] = i;

                }

                // vertices
                for (var i = 0, il = vertices2.length; i < il; i++) {

                    var vertex = vertices2[i];

                    var vertexCopy = vertex.clone();

                    if (matrix) {
                        matrix.multiplyVector3(vertexCopy);
                    }

                    vertices1.push(vertexCopy);

                }

                // faces
                for (i = 0, il = faces2.length; i < il; i++) {

                    var face = faces2[i],
                        faceCopy, normal, color,
                        faceVertexNormals = face.vertexNormals,
                        faceVertexColors = face.vertexColors;


                    faceCopy = new THREE.Face3(face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset);

                    faceCopy.normal.copy(face.normal);

                    if (matrixRotation) {
                        matrixRotation.multiplyVector3(faceCopy.normal);
                    }

                    for (var j = 0, jl = faceVertexNormals.length; j < jl; j++) {

                        normal = faceVertexNormals[j].clone();

                        if (matrixRotation) {
                            matrixRotation.multiplyVector3(normal);
                        }

                        faceCopy.vertexNormals.push(normal);

                    }

                    faceCopy.color.copy(face.color);

                    for (var j = 0, jl = faceVertexColors.length; j < jl; j++) {

                        color = faceVertexColors[j];
                        faceCopy.vertexColors.push(color.clone());

                    }

                    if (face.materialIndex !== undefined) {



                        var material2 = materials2[face.materialIndex];
                        var materialId2 = material2.id;

                        var materialIndex = geo1MaterialsMap[materialId2];

                        if (materialIndex === undefined) {

                            materialIndex = materials1.length;
                            geo1MaterialsMap[materialId2] = materialIndex;

                            materials1.push(material2);

                        }

                        faceCopy.materialIndex = materialIndex;

                    }

                    faceCopy.centroid.copy(face.centroid);
                    if (matrix) {
                        matrix.multiplyVector3(faceCopy.centroid);
                    }

                    faces1.push(faceCopy);

                }

                // uvs
                for (i = 0, il = uvs2.length; i < il; i++) {

                    var uv = uvs2[i],
                        uvCopy = [];

                    for (var j = 0, jl = uv.length; j < jl; j++) {

                        uvCopy.push(new THREE.Vector2(uv[j].x, uv[j].y));

                    }

                    uvs1.push(uvCopy);

                }

            }

            var mergedMeshes = new THREE.Mesh(mergedMeshesGeometry, new THREE.MeshFaceMaterial(mergedMaterialsCollection));

            newWorld.add(mergedMeshes);
            newWorld.add(entitiesCollection);

            return newWorld;
        };


        var saveProcessedWorld = function (world, savePath, cb) {

            var exporter = new THREE.ObjectExporter();

            var parsedWorld = exporter.parse(world);

            fs.writeFile(savePath, JSON.stringify(parsedWorld, null, 4), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Saved ' + savePath);
                    if (cb) {
                        cb();
                    }
                }
            });
        };

        var loopChildren = function (obj, fn) {
            fn(obj);
            obj.children.forEach(function (child) {
                loopChildren(child, fn);
            });
        };

        exportClaraScenes();

        // For testing...
        // var zonePath = angus.appPath + '/src/assets/scene/storage-room';
        // var claraExportJson = require(zonePath + '/clara-export.json');
        // var ibWorldFilepath = zonePath + '/ib-world.json';
        // var ibWorld = postProcessWorld(claraExportJson);
        // saveProcessedWorld(ibWorld, ibWorldFilepath);
    };
};
