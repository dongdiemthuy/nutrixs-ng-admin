/*global define*/

define(function (require) {
    'use strict';

    var referenceManyObjectColumnView = require('text!./ReferenceManyObjectColumn.html');

    function ReferenceManyObjectColumn($location, Configuration) {
        return {
            restrict: 'E',
            template: referenceManyObjectColumnView,
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

    ReferenceManyObjectColumn.$inject = ['$location', 'NgAdminConfiguration'];

    return ReferenceManyObjectColumn;
});
