angular.module('engine.input.keyboard', ['keypress'])
/* keypress api
simple_combo(keys, on_keydown_callback); // Registers a very basic combo;
counting_combo(keys, on_count_callback); // Registers a counting combo
sequence_combo(keys, callback); // Registers a sequence combo
register_combo(combo_dictionary); // Registers a combo from a dictionary
register_many(combo_dictionary_array); // Registers an array of dictionaries
unregister_combo(keys_or_combo_dictionary); // Unregisters a single combo
unregister_many(array_of_keys_or_combo_dictionaries); // Unregisters many combos
get_registered_combos(); // Get a list of the combos registered with this listener
reset(); // Unregister all combos
listen(); // Begin listening. Listener is listening by default
stop_listening(); // Stop listening for combos until listen() is called again
*/
.factory('Keyboard', function(KeypressListener) {
    'use strict';

    var Keyboard = function () {
        // TODO: allow element target?
        this._listener = new KeypressListener();
    };

    Keyboard.prototype.simpleCombo = function (keys, onKeydown) {
        return this._listener.simple_combo(keys, onKeydown); // jshint ignore:line
    };

    Keyboard.prototype.countingCombo = function (keys, onCount) {
        return this._listener.counting_combo(keys, onCount); // jshint ignore:line
    };

    Keyboard.prototype.sequenceCombo = function (keys, callback) {
        return this._listener.sequence_combo(keys, callback); // jshint ignore:line
    };

    Keyboard.prototype.registerCombo = function (combo) {
        return this._listener.register_combo(combo); // jshint ignore:line
    };

    Keyboard.prototype.registerCombos = function (combos) {
        return this._listener.register_many(combos); // jshint ignore:line
    };

    Keyboard.prototype.unregisterCombo = function (combo) {
        return this._listener.unregister_combo(combo); // jshint ignore:line
    };

    Keyboard.prototype.unregisterCombos = function (combos) {
        return this._listener.unregister_many(combos); // jshint ignore:line
    };

    Keyboard.prototype.reset = function () {
        return this._listener.reset();
    };

    Keyboard.prototype.listen = function () {
        return this._listener.listen();
    };

    Keyboard.prototype.stopListening = function () {
        return this._listener.stop_listening(); // jshint ignore:line
    };

    return Keyboard;
});
