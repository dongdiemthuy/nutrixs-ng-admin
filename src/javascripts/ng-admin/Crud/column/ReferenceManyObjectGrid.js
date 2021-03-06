/*global define*/

define(function (require) {
    'use strict';

    var ReferenceManyObjectGridView = require('text!./ReferenceManyObjectGrid.html');

    function ReferenceManyObjectGrid($location, Configuration) {
        return {
            restrict: 'E',
            template: ReferenceManyObjectGridView,
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

    ReferenceManyObjectGrid.$inject = ['$location', 'NgAdminConfiguration'];

    return ReferenceManyObjectGrid;
});
