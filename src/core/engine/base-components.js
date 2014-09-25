angular.module('engine.base-components', ['ces-sugar'])
    .config([
        '$componentsProvider',
        function ($componentsProvider) {
            'use strict';

            var COMPONENTS = {
                'transform': {
                    'position': {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    'rotation': {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    'scale': {
                        x: 1,
                        y: 1,
                        z: 1
                    }
                },
                'speed': {
                    value: 0
                },
                'eightWay': null,
                'three-link': {
                    id: ''
                },
                'mesh': {
                    geometryType: 'box'
                },
                'texture': {
                    file: '',
                    offset: [0, 0],
                    repeat: [1, 1],
                    minFilter: 1006, // three constants usually...
                    magFilter: 1008
                },
                'camera': {
                    projection: 'perspective',
                    fov: 70,
                    aspect: 1,
                    near: 0.1,
                    far: 2000
                }
            };

            $componentsProvider.addPreloadData(COMPONENTS);
        }
    ]);