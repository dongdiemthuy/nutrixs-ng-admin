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
    function ReferenceManyAggregation(name) {
        Reference.apply(this, arguments);

        this.config.name = name || 'reference-many-aggregation';
        this.config.type = 'ReferenceManyAggregation';
        this.entries = [];
    }

    utils.inherits(ReferenceManyAggregation, Reference);
    Configurable(ReferenceManyAggregation.prototype, config);

    /**
     * Set or get the type
     *
     * @param {[Field]} targetFields
     * @returns ReferencedList
     */
    ReferenceManyAggregation.prototype.targetFields = function (targetFields) {
        if (arguments.length === 0) {
            return this.config.targetFields;
        }

        var i;

        this.referencedView.removeFields();
        for (i in targetFields) {
            this.referencedView.addField(targetFields[i]);
        }

        //TODO: Should be removed
        this.config.targetField = targetFields[0];

        this.config.targetFields = targetFields;

        return this;
    };

    ReferenceManyAggregation.prototype.getChoicesById = function () {
        var result = {},
            entry,
            targetEntity = this.targetEntity(),
            targetLabel = this.targetField().name(),
            targetIdentifier = targetEntity.identifier().name(),
            i,
            l;

        for (i = 0, l = this.entries.length; i < l; i++) {
            entry = this.entries[i];

            modifiedEntry = {};
            for (j = 0, m = this.config.targetFields.length; j < m; j++) {
                field = this.config.targetFields[j];
                if (!field.displayed()) {
                    continue;
                }
                modifiedEntry[field.name()] = entry[field.name()];
            }
            result[entry[targetIdentifier]] = modifiedEntry;
        }

        console.log("result:");
        console.log(result);
        return result;
    };

    /**
     * Returns columns used to display the datagrid
     *
     * @returns {Array}
     */
    ReferenceManyAggregation.prototype.getGridColumns = function () {
        var columns = [],
            field,
            i,
            l;

        for (i = 0, l = this.config.targetFields.length; i < l; i++) {
            field = this.config.targetFields[i];
            if (!field.displayed()) {
                continue;
            }

            columns.push({
                name: field.name(),
                label: field.label()
            });
        }
        console.log(columns);
        return columns;
    };

    return ReferenceManyAggregation;
});
