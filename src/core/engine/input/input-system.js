angular.module('engine.input.input-system', ['ces', 'engine.input.keyboard'])
.factory('InputSystem', function(System, Keyboard) {
    var InputSystem = System.extend({
        init: function () {
            this.keyboard = new Keyboard();
            this.keyboard.listen();
        },
        update: function () {
            // not yet implemented...
        }
    });

    return InputSystem;
});
