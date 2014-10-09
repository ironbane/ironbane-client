angular.module('game.entities.torch', ['ces', 'three'])
.factory('Torch', function(Entity, $components, THREE) {
    function createTorch(transform) {
        var entity = new Entity();

        if(angular.isArray(transform)) {
            var matrix = new THREE.Matrix4();
            matrix.fromArray(transform);
            matrix.decompose(entity.position, entity.quaternion, entity.scale);
        } else if (angular.isObject(transform)) {
            entity.position.fromArray(transform.position);
            entity.rotation.fromArray(transform.rotation);
            entity.scale.fromArray(transform.scale);
        }

        var lightBall = $components.get('model', {type: 'Sphere'});
        entity.addComponent(lightBall);

        return entity;
    }

    return createTorch;
});