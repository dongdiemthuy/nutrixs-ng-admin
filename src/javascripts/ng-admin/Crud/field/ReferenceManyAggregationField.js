/*global define*/

define(function (require) {
    'use strict';

    var referenceManyAggregationFieldView = require('text!./ReferenceManyAggregationField.html');

    function ReferenceManyAggregationField($scope) {
        $scope.selected = {};
       //khai bao controller ben ngoai o FormController          
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

    function ReferenceManyAggregationFieldDirective() {
        return {
            restrict: 'E',
            controller: ReferenceManyAggregationField,
            controllerAs: 'referenceManyAggregationField',
            scope: { records: '=', targets: '=', columns: '='},
            template: referenceManyAggregationFieldView,
            replace: true,
            link: function($scope, element, attrs) {
                $scope.selected = {};

                var evalExpression = function() {
                    for(var i=0; i<$scope.columns.length; i++) {
                        if ($scope.columns[i]['type'] == 'expression') {
        
                            for(var j=0; j<$scope.records.length; j++) {
                                // evaluates expression
                                var result = $scope.$eval($scope.columns[i]['expression'], $scope.records[j]);
                                $scope.records[j][$scope.columns[i]['name']] = result;
                            }
                        }
                    }
                }


                var generateUUID = function(){
                    var d = new Date().getTime();
                    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
                        replace(/[xy]/g, function(c) {
                          var r = (d + Math.random()*16)%16 | 0;
                          d = Math.floor(d/16);
                          return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                        });
                      return uuid;
                  };

                var initColumns = function() {
                    if ($scope.records == null) {
                        $scope.records = [];
                    }
                    var targets = $scope.targets;
                    for(var i=0; i<targets.length; i++) {
                        var found = false;
                        for(var k=0; k<$scope.records.length; k++) {
                            if (targets[i].id == $scope.records[k].id) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            var newItem = {
                                id: targets[i].id,
                                name: targets[i].name
                            };
                            $scope.records.push(newItem);
                        }
                    }
                  
                };

                initColumns();

                $scope.checkDataFieldAvailable = function(record, field) {
                    if (angular.isDefined(record[field['name']]) && record[field['name']]) return "true";
                    return "false";
                }
                $scope.removeItem = function(index) {
                    $scope.records.splice(index, 1);
                },

                $scope.editItem = function (contact) {
                    $scope.selected = angular.copy(contact);
                },

                $scope.saveItem = function (idx) {
                    console.log("Saving contact");
                    $scope.selected = {};
                    //evalExpression();
                },

                $scope.reset = function () {
                    for (var i = 0; i < $scope.records.length; i++) {
                      if ($scope.records[i].id == $scope.selected.id) {
                        $scope.records[i] = $scope.selected;
                        break;
                      }
                    }
                    $scope.selected = {};
                },

                $scope.getTemplate = function (item) {
                    if (item.id === $scope.selected.id) return 'edit';
                        else return 'display';
                },

                $scope.isExpression = function(field) {
                    if (field.type == 'expression') return "true";
                    return "false";
                }
            }
        };
    }

    ReferenceManyAggregationFieldDirective.$inject = [];

    return ReferenceManyAggregationFieldDirective;
});

