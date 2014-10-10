(function () {
    var TestScript = function (entity) {
        this.entity = entity;
        console.log('TestScript added to ', entity.name);
    };

    TestScript.prototype.update = function (dt, elapsed) {
        this.entity.rotation.y += Math.cos(elapsed / 1000) / 10 * 2;
    };

    return TestScript;
})();