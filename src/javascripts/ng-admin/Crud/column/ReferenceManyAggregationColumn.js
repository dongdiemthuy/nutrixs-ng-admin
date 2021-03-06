/*global define*/

define(function (require) {
    'use strict';

    var referenceManyAggregationColumnView = require('text!./ReferenceManyAggregationColumn.html');

    function ReferenceManyAggregationColumn($location, Configuration) {
        return {
            restrict: 'E',
            template: referenceManyAggregationColumnView,
            link: function ($scope) {
                console.log($scope.entry);
                var field = $scope.field;
                var referenceEntity = field.targetEntity().name();
                var relatedEntity = Configuration().getEntity(referenceEntity);
                console.log($scope.entry);
                $scope.hasRelatedAdmin = function() {
                    if (!relatedEntity) return false;
                    return relatedEntity.isReadOnly ? relatedEntity.showView().isEnabled() : relatedEntity.editionView().isEnabled();
                };
                $scope.gotoReference = function (referenceId) {
                    var route = relatedEntity.isReadOnly ? 'show' : 'edit'
                    $location.path('/' + route + '/' + referenceEntity + '/' + referenceId);
                };
            }
        };
    }

    ReferenceManyAggregationColumn.$inject = ['$location', 'NgAdminConfiguration'];

    return ReferenceManyAggregationColumn;
});
