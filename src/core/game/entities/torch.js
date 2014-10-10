angular.module('game.entities.torch', ['ces', 'three'])
.factory('Torch', function(Entity, $components, THREE) {
    return {
        components: {
            'model': {
                type: 'Sphere'
            },
            'light': {
                type: 'PointLight'
            }
        }
    };
});