/*global define*/

define(function (require) {
    'use strict';

    var numberColumnView = require('text!./NumberColumn.html');

    function NumberColumn() {
        return {
            restrict: 'E',
            template: numberColumnView
        };
    }

    NumberColumn.$inject = [];

    return NumberColumn;
});
