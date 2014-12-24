/*global define*/

define(function (require) {
    'use strict';

    var referenceManyAggregationFieldView = require('text!./ReferenceManyAggregationField.html');

    function ReferenceManyAggregationField($scope) {
        $scope.records = {
            selected: {},
            mtag: [{
                "id": 'abce-dadfd-edbdhd',
                "name": "Sport",
                "published": 1,
                "value": "12,8g"
            }]
        };
    }

    ReferenceManyAggregationField.prototype.contains = function (collection, item) {
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
    

    // function ReferenceManyAggregationFieldDirective() {
    //     return {
    //         restrict: 'E',
    //         template: referenceManyAggregationFieldView,
    //         controller: ReferenceManyAggregationField,
    //         controllerAs: 'referenceManyAggregationField',
    //         link: function (scope) {
    //             scope.choices = scope.field.getChoices();
    //         }
    //     };
    // }


    // ReferenceManyAggregationFieldDirective.$inject = [];

    //return ReferenceManyAggregationFieldDirective;

    function ReferenceManyAggregationFieldDirective() {
        return {
            restrict: 'E',
            controller: ReferenceManyAggregationField,
            controllerAs: 'referenceManyAggregationField',
            scope: { records: '=' },
            template: referenceManyAggregationFieldView,
            //templateUrl: 'nutrixs-ng-admin/src/javascripts/ng-admin/field/ReferenceManyAggregationField.html',
            replace: true,
            link:  function($scope, element, attrs) {
                console.log("qqqqqqq");
                var generateUUID = function() {
                    var d = new Date().getTime();
                    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
                        replace(/[xy]/g, function(c) {
                          var r = (d + Math.random()*16)%16 | 0;
                          d = Math.floor(d/16);
                          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                        });
                      return uuid;
                };
          
                $scope.addItem = function() {
                    console.log("aaaaa:" + $scope.records.mtag.length);
                    var newItem = {
                        id: generateUUID(),
                        name: "",
                        published: 1
                    };
                    $scope.records.mtag.push(newItem);
                    $scope.records.selected = newItem;
                },

                $scope.removeItem = function(index) {
                    $scope.records.mtag.splice(index, 1);
                },

                $scope.editItem = function (item) {
                    $scope.records.selected = angular.copy(item);
                },

                $scope.saveItem = function (idx) {
                    $scope.records.selected = {};
                },

                $scope.reset = function () {
                    for (var i = 0; i < $scope.records.mtag.length; i++) {
                        if ($scope.records.mtag[i].id == $scope.records.selected.id) {
                        $scope.records.mtag[i] = $scope.records.selected;
                        break;
                    }
                    }
                    $scope.records.selected = {};
                },

                $scope.getTemplate = function (item) {
                    if (item.id === $scope.records.selected.id) return 'edit';
                        else return 'display';
                }
            }
        };
    }

    ReferenceManyAggregationFieldDirective.$inject = [];

    return ReferenceManyAggregationFieldDirective;


    // var Controller = function ($scope){
    //     $scope.tag = {
    //         selected: {},
    //         mtag: [{
    //             "id": 'abce-dadfd-edbdhd',
    //             "name": "Sport",
    //             "published": 1
    //         }]
    //     };
});
