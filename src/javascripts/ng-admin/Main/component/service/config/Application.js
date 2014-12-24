/*global define*/

define(function (require) {
    'use strict';

    var angular = require('angular'),
        Configurable = require('ng-admin/Main/component/service/config/Configurable');

    var config = {
        title: "Angular admin",
        baseApiUrl: "http://localhost:3000/"
    };

    function Application(title) {
        this.entities = {};
        this.config = angular.copy(config);
        this.config.title = title || this.config.title;
    }

    /**
     * Add an entity to the configuration
     * @param {Entity} entity
     */
    Application.prototype.addEntity = function (entity) {
        if (entity.order() === null) {
            entity.order(Object.keys(this.entities).length);
        }

        this.entities[entity.name()] = entity;

        return this;
    };

    /**
     * Returns true if the application has the entity
     * @param {String} name
     * @returns {boolean}
     */
    Application.prototype.hasEntity = function (name) {
        return name in this.entities;
    };

    /**
     * Returns an Entity by it's name
     *
     * @param {String} name
     * @returns {Entity}
     */
    Application.prototype.getEntity = function (name) {
        return this.entities[name];
    };

    /**
     * Returns all entities
     *
     * @returns {[Entity]}
     */
    Application.prototype.getEntities = function () {
        return this.entities;
    };

    /**
     * Returns all entity names
     *
     * @returns {Array}
     */
    Application.prototype.getEntityNames = function () {
        return Object.keys(this.entities);
    };

    /**
     * Returns all entities
     *
     * @returns {[View]}
     */
    Application.prototype.getViewsOfType = function (type) {
        var views = [], i;

        for (i in this.entities) {
            views.push(this.entities[i].getViewByType(type));
        }

        return views;
    };

    /**
     * Return one view of a type for an entity
     *
     * @param {String} entityName
     * @param {String} type
     *
     * @return {View}
     */
    Application.prototype.getViewByEntityAndType = function (entityName, type) {
        var entity = this.getEntity(entityName);

        return entity.getViewByType(type);
    };

    Configurable(Application.prototype, config);

    return Application;
});
