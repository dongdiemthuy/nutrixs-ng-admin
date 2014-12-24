/*global define*/

define(function (require) {
    'use strict';

    var referenceManyObjectFieldView = require('text!./ReferenceManyObjectField.html');

    function ReferenceManyObjectField() {
    }

    ReferenceManyObjectField.prototype.contains = function (collection, item) {
        if (!collection) {
            return false;
        }

        for (var i = 0, l = collection.length; i < l; i++) {
            if (collection[i] == item) {
                return true;
            }
        }

        return false;
    };

    function ReferenceManyObjectFieldDirective() {
        return {
            restrict: 'E',
            template: referenceManyObjectFieldView,
            controller: ReferenceManyObjectField,
            controllerAs: 'referenceManyObjectField',
            link: function (scope) {
                scope.choices = scope.field.getChoices();
            }
        };
    }

    ReferenceManyObjectFieldDirective.$inject = [];

    return ReferenceManyObjectFieldDirective;
});
