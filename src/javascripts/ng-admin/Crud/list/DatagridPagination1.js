// /*global define*/

// define(function (require) {
//     'use strict';

//     var angular = require('angular'),
//         paginationView = require('text!./DatagridPagination.html'),
//         DatagridPaginationController = require('./DatagridPaginationController');

//     function DatagridPaginationDirective($window, $document) {
//         // return {
//         //     restrict: 'E',
//         //     template: paginationView,
//         //     controllerAs: 'paginationCtrl',
//         //     controller: DatagridPaginationController,
//         //     link: function (scope, element, attrs, controller) {
//         //         var offset = attrs.offset || 100,
//         //             body = $document[0].body;

//         //         scope.hasPagination = !element.parent()[0].hasAttribute('with-pagination') ? true : scope.$eval(element.parent()[0].getAttribute('with-pagination'));
//         //         if (scope.hasPagination) {
//         //             controller.computePagination();
//         //         }

//         //         angular.element($window).bind('scroll', function () {
//         //             if (body.offsetHeight - $window.innerHeight - $window.scrollY < offset) {
//         //                 scope.$apply(controller.nextPage.bind(controller));
//         //             }
//         //         });
//         //     }
//         // };
//             return {
//                 retrict: 'AE',
//                 template: paginationView,
//                 controllerAs: 'paginationCtrl',
//                 controller: DatagridPaginationController,
//                 scope: {
//                 maxSize: '=?',
//                 onPageChange: '&?',
//                 paginationId: '=?'
//                 },
//                 link: function dirPaginationControlsLinkFn(scope, element, attrs, controller) {

//                 // rawId is the un-interpolated value of the pagination-id attribute. This is only important when the corresponding dir-paginate directive has
//                 // not yet been linked (e.g. if it is inside an ng-if block), and in that case it prevents this controls directive from assuming that there is
//                 // no corresponding dir-paginate directive and wrongly throwing an exception.
//                 var rawId = attrs.paginationId ||  DEFAULT_ID;
//                 var paginationId = scope.paginationId || attrs.paginationId ||  DEFAULT_ID;

//                 // if (!paginationService.isRegistered(paginationId) && !paginationService.isRegistered(rawId)) {
//                 //     var idMessage = (paginationId !== DEFAULT_ID) ? ' (id: ' + paginationId + ') ' : ' ';
//                 //     throw 'pagination directive: the pagination controls' + idMessage + 'cannot be used without the corresponding pagination directive.';
//                 // }

//                 if (!scope.maxSize) { scope.maxSize = 9; }
//                 scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : true;
//                 scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : false;

//                 var paginationRange = Math.max(scope.maxSize, 5);
//                 scope.pages = [];
//                 scope.pagination = {
//                     last: 1,
//                     current: 1
//                 };
//                 scope.range = {
//                     lower: 1,
//                     upper: 1,
//                     total: 1
//                 };

//                 scope.$watch(function() {
//                     return (paginationService.getCollectionLength(paginationId) + 1) * paginationService.getItemsPerPage(paginationId);
//                 }, function(length) {
//                     if (0 < length) {
//                         generatePagination();
//                     }
//                 });
                
//                 scope.$watch(function() {
//                     return (paginationService.getItemsPerPage(paginationId));
//                 }, function(current, previous) {
//                     if (current != previous) {
//                         goToPage(scope.pagination.current);
//                     }
//                 });

//                 scope.$watch(function() {
//                     return paginationService.getCurrentPage(paginationId);
//                 }, function(currentPage, previousPage) {
//                     if (currentPage != previousPage) {
//                         goToPage(currentPage);
//                     }
//                 });

//                 scope.setCurrent = function(num) {
//                     if (isValidPageNumber(num)) {
//                         paginationService.setCurrentPage(paginationId, num);
//                     }
//                 };
//             }
//     }

//     DatagridPaginationDirective.$inject = ['$window', '$document'];

//     return DatagridPaginationDirective;
// });


/*global define*/

