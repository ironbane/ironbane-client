'use strict';

(function() {
    var module = angular.module('ammo', []);
    module.factory('Ammo', function($window) { return $window.Ammo; });
})();
