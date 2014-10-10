(function() {
    var TestScript = function(entity) {
        this.entity = entity;
        console.log('TestScript added to ', entity.name);
    };

    TestScript.prototype.update = function (dt) {
        this.entity.rotation.y += dt * 0.05;
    };

    return TestScript;
})();