/*global define*/

define(function (require) {
    'use strict';

    var Configurable = require('ng-admin/Main/component/service/config/Configurable'),
        Reference = require('ng-admin/Main/component/service/config/Reference'),
        utils = require('ng-admin/lib/utils');

    var config = {
        name: 'myReference',
        label: 'My references',
        targetFields : []
    };

    /**
     * @constructor
     *
     * @param {String} name
     */
    function ReferenceManyObject(name) {
        Reference.apply(this, arguments);

        this.config.name = name || 'reference-many-object';
        this.config.type = 'ReferenceManyObject';
    }

    /**
     * Set or get the type
     *
     * @param {[Field]} targetFields
     * @returns ReferencedList
     */
    ReferenceManyObject.prototype.targetFields = function (targetFields) {
        if (arguments.length === 0) {
            return this.config.targetFields;
        }

        var i;

        this.referencedView.removeFields();
        for (i in targetFields) {
            this.referencedView.addField(targetFields[i]);
        }

        this.config.targetFields = targetFields;

        return this;
    };

    utils.inherits(ReferenceManyObject, Reference);
    Configurable(ReferenceManyObject.prototype, config);

    return ReferenceManyObject;
});
