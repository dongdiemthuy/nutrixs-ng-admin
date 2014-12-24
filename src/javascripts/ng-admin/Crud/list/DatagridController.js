/*global define*/

define(function () {
    'use strict';

    /**
     *
     * @param {$scope} $scope
     * @param {$location} $location
     * @constructor
     */
    function DatagridController($scope, $location, $anchorScroll) {
        this.$scope = $scope;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;

        this.$scope.gotoDetail = this.gotoDetail.bind(this);

        var searchParams = this.$location.search();
        this.sortField = 'sortField' in searchParams ? searchParams.sortField : '';
        this.sortDir = 'sortDir' in searchParams ? searchParams.sortDir : '';

        $scope.$watch("view", function () {
            var view = $scope.view;
            $scope.fields = view.getDisplayedFields();
            $scope.listActions = view.listActions();
            $scope.entity = view.getEntity();
        });
    }

    /**
     * Link to edit entity page
     *
     * @param {Entry} entry
     */
    DatagridController.prototype.gotoDetail = function (entry) {
        this.clearRouteParams();
        var route = this.$scope.view.getEntity().isReadOnly ? 'show' : 'edit';

        this.$location.path('/' + route + '/' + entry.entityName + '/' + entry.identifierValue);
        this.$anchorScroll(0);
    };

    DatagridController.prototype.clearRouteParams = function () {
        this.$location.search('q', null);
        this.$location.search('page', null);
        this.$location.search('sortField', null);
        this.$location.search('sortDir', null);
    };

    /**
     * Return true if a column is being sorted
     *
     * @param {Field} field
     *
     * @returns {Boolean}
     */
    DatagridController.prototype.isSorting = function (field) {
        return this.sortField === this.getSortName(field);
    };

    /**
     * Return 'even'|'odd' based on the index parameter
     *
     * @param {Number} index
     * @returns {string}
     */
    DatagridController.prototype.itemClass = function (index) {
        return (index % 2 === 0) ? 'even' : 'odd';
    };

    /**
     *
     * @param {Field} field
     */
    DatagridController.prototype.sort = function (field) {
        var dir = 'ASC',
            fieldName = this.getSortName(field);

        if (this.sortField === fieldName) {
            dir = this.sortDir === 'ASC' ? 'DESC' : 'ASC';
        }

        this.$location.search('sortField', fieldName);
        this.$location.search('sortDir', dir);
    };

    /**
     * Return fieldName like (view.fieldName) to sort
     *
     * @param {Field} field
     *
     * @returns {String}
     */
    DatagridController.prototype.getSortName = function (field) {
        return this.$scope.name + '.' + field.name();
    };

    DatagridController.$inject = ['$scope', '$location', '$anchorScroll'];

    return DatagridController;
});
