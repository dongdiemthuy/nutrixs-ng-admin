/*global define*/

define(function (require) {
    'use strict';

    var ReferenceManyAggregationGridView = require('text!./ReferenceManyAggregationGrid.html');

    function ReferenceManyAggregationGrid($location, Configuration) {
        return {
            restrict: 'E',
            template: ReferenceManyAggregationGridView,
            link: function ($scope) {
                var field = $scope.field;
                var referenceEntity = field.targetEntity().name();
                var relatedEntity = Configuration().getEntity(referenceEntity);
                $scope.hasRelatedAdmin = function() {
                    if (!relatedEntity) return false;
                    return relatedEntity.isReadOnly ? relatedEntity.showView().isEnabled() : relatedEntity.editionView().isEnabled();
                };
                $scope.gotoReference = function (referenceId) {
                    var route = relatedEntity.isReadOnly ? 'show' : 'edit'
                    $location.path('/' + route + '/' + referenceEntity + '/' + referenceId);
                    console.log('============:=' + referenceEntity);
                };
            }
        };
    }

    ReferenceManyAggregationGrid.$inject = ['$location', 'NgAdminConfiguration'];

    return ReferenceManyAggregationGrid;
});
