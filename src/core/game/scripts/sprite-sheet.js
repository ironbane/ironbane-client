angular.module('game.scripts.sprite-sheet', ['components.script', 'three'])
    .run(function (ScriptBank, THREE) {
        'use strict';

        var displayUVFrame = function (mesh, indexH, indexV, numberOfSpritesH, numberOfSpritesV, mirror) {

            mirror = mirror || false;

            var amountU = (1 / numberOfSpritesH);
            var amountV = (1 / numberOfSpritesV);

            var uvs1 = mesh.geometry.faceVertexUvs[0][0];
            var uvs2 = mesh.geometry.faceVertexUvs[0][1];

            if (!mirror) {
                uvs1[0].x = amountU * indexH;
                uvs1[0].y = 1 - (amountV * indexV);

                uvs1[1].x = uvs1[0].x;
                uvs1[1].y = uvs1[0].y - amountV;

                uvs1[2].x = uvs1[0].x + amountU;
                uvs1[2].y = uvs1[0].y;
            } else {
                uvs1[0].x = amountU * (indexH + 1);
                uvs1[0].y = 1 - (amountV * indexV);

                uvs1[1].x = uvs1[0].x;
                uvs1[1].y = uvs1[0].y - amountV;

                uvs1[2].x = uvs1[0].x - amountU;
                uvs1[2].y = uvs1[0].y;
            }

            uvs2[0].x = uvs1[1].x;
            uvs2[0].y = uvs1[1].y;

            uvs2[1].x = uvs1[2].x;
            uvs2[1].y = uvs1[1].y;

            uvs2[2].x = uvs1[2].x;
            uvs2[2].y = uvs1[2].y;

            mesh.geometry.uvsNeedUpdate = true;
        };



        var SpriteSheetScript = function (entity) {
            this.entity = entity;
        };

        SpriteSheetScript.prototype.update = function (dt, elapsed, timestamp) {
            // this script should be attached to an entity with a camera component....
            var quadComponent = this.entity.getComponent('quad');

            if (quadComponent) {
                var quad = quadComponent.quad;

                displayUVFrame(quad, 0, 0, 3, 8, false);
                // console.log(quadComponent);
                // throw error?
                // return;
            }

        };

        ScriptBank.add('/scripts/built-in/sprite-sheet.js', SpriteSheetScript);
    });
