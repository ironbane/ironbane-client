angular.module('ces.entity', [
    'three',
    'ces.signal'
])
    .factory('Entity', function (THREE, Signal) {
        'use strict';

        var Entity = function () {
            THREE.Object3D.call(this);

            this._components = {};
            this.onComponentAdded = new Signal();
            this.onComponentRemoved = new Signal();
        };

        Entity.prototype = Object.create(THREE.Object3D.prototype);
        Entity.prototype.constructor = Entity;

        /**
         * Check if this entity has a component by name.
         * @public
         * @param {String} componentName
         * @return {Boolean}
         */
        Entity.prototype.hasComponent = function (componentName) {
            return this._components['$' + componentName] !== undefined;
        };

        /**
         * Get a component of this entity by name.
         * @public
         * @param {String} componentName
         * @return {Component}
         */
        Entity.prototype.getComponent = function (componentName) {
            return this._components['$' + componentName];
        };

        /**
         * Add a component to this entity.
         * @public
         * @param {Component} component
         */
        Entity.prototype.addComponent = function (component) {
            this._components['$' + component.name] = component;
            this.onComponentAdded.emit(this, component.name);
        };

        /**
         * Remove a component from this entity by name.
         * @public
         * @param {String} componentName
         */
        Entity.prototype.removeComponent = function (componentName) {
            this._components['$' + componentName] = undefined;
            this.onComponentRemoved.emit(this, componentName);
        };

        return Entity;
    });
