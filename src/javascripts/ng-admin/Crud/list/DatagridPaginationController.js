// /*global define*/

define(function () {
    'use strict';

    function DatagridPaginationController($scope, $location, $anchorScroll, progression, RetrieveQueries) {
        this.$scope = $scope;
        this.$location = $location;
        this.loadingPage = false;
        this.$anchorScroll = $anchorScroll;
        this.progression = progression;
        this.RetrieveQueries = RetrieveQueries;
    }

    DatagridPaginationController.prototype.computePagination = function () {
        var perPage = this.$scope.view.perPage(),
            currentPage = this.$location.search().page || 1,
            totalItems = this.$scope.totalItems;

        this.infinitePagination = this.$scope.hasPagination && this.$scope.view.infinitePagination();
        this.currentPage = currentPage;
        this.offsetBegin = (currentPage - 1) * perPage + 1;
        this.offsetEnd = Math.min(currentPage * perPage, totalItems);
        this.totalItems = totalItems;

        this.nbPages = Math.ceil(totalItems / (perPage || 1)) || 1;
    };

    /**
     * Return an array with the range between min & max, useful for pagination
     *
     * @param {int} min
     * @param {int} max
     * @returns {Array}
     */
    DatagridPaginationController.prototype.rangeOld = function (min, max) {
        var input = [],
            i;

        for (i = min; i <= max; i++) {
            input.push(i);
        }

        return input;
    };

    DatagridPaginationController.prototype.range = function (min, currentS, max) {
        var input = [],
            i;
        
        var current = parseInt(currentS);
        
        if (max - min < 10) {
            for (i = min; i <= max; i++) {
                input.push(i);
            }

        } else {
            console.log(min, current, max);

            middleleft = Math.floor((current - 1 - 3)/2);
         
            for(i = min; i < min+3; i++) {
                input.push(i);
            }
            if (i < current - 1) {
                input.push(-i);
                if (i + 20 < current - 1) {
                    input.push(Math.floor((current - 1 + i)/2));
                    input.push(-(current - 2));
                }
            }

            for(; i < current - 1; i++) {
                // if (i == middleleft) {
                //     input.push(i);    
                // } 
                //else
                //input.push(-i);
            }
            for(; ((i < current+3) && (i < max-2)); i++) {
                input.push(i);
            }
            if (i<max-2) {
                input.push(-i);
                if (i + 20 < max-2) {
                    input.push(Math.floor((i + max-2)/2));
                    input.push(-(max-3));
                }
            }
            for(; i < max - 2; i++) {
                //input.push(-i);
            }
            for(; i<= max; i++) {
                input.push(i);
            }
        }

        return input;
    };

    DatagridPaginationController.prototype.nextPage = function () {
        var view = this.$scope.view;
        if (this.loadingPage || !this.infinitePagination || this.currentPage === this.nbPages) {
            return;
        }

        var self = this,
            searchParams = this.$location.search(),
            sortField = 'sortField' in searchParams ? searchParams.sortField : '',
            sortDir = 'sortDir' in searchParams ? searchParams.sortDir : '';

        this.loadingPage = true;
        this.currentPage++;

        this.progression.start();
        this.RetrieveQueries
            .getAll(view, this.currentPage, true, null, sortField, sortDir)
            .then(function (nextData) {
                self.progression.done();

                self.$scope.entries = self.$scope.entries.concat(nextData.entries);
                self.loadingPage = false;
            });
    };

    /**
     * Link to page number of the list
     *
     * @param {int} number
     */
    DatagridPaginationController.prototype.setPage = function (number) {
        if (number <= 0 || number > this.nbPages) {
            return;
        }

        this.$location.search('page', number);
        this.$anchorScroll(0);
    };

    DatagridPaginationController.$inject = ['$scope', '$location', '$anchorScroll', 'progression', 'RetrieveQueries'];

    return DatagridPaginationController;
});


/*global define*/

