angular.module('game.prefabs.torch', [])
    .constant('TorchPrefab', {
        components: {
            'model': {
                type: 'Sphere'
            },
            'light': {
                type: 'PointLight'
            }
        }
    });
