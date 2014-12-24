/*global angular*/
(function () {
    "use strict";

    var app = angular.module('myApp', ['ng-admin']);

    app.directive('customPostLink', ['$location', function ($location) {
        return {
            restrict: 'E',
            template: '<a ng-click="displayPost(entry)">View&nbsp;post</a>',
            link: function ($scope) {
                $scope.displayPost = function (entry) {
                    var postId = entry.values.ingredientId;

                    $location.path('/edit/posts/' + postId);
                };
            }
        };
    }]);

    app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList, ReferenceMany) {

        function truncate(value) {
            if (!value) {
                return '';
            }

            return value.length > 50 ? value.substr(0, 50) + '...' : value;
        }

        function pagination(page, maxPerPage) {
            return {
                _start: (page - 1) * maxPerPage,
                _end: page * maxPerPage
            };
        }

        var app = new Application('Nutrients Backend') // application main title
            .baseApiUrl('http://localhost:2403/'); // main API endpoint

        // define all entities at the top to allow references between them
        var ingredient = new Entity('ingredients');
        var nutrient = new Entity('nutrients').readOnly();

        // set the application entities
        app
            .addEntity(ingredient)
            .addEntity(nutrient);

        // customize entities and views

        ingredient.menuView();
        ingredient.dashboardView()
            .title('Ingredients')
            .order(1) // display the post panel first in the dashboard
            .limit(5) // limit the panel to the 5 latest posts
            .pagination(pagination) // use the custom pagination function to format the API request correctly
            .addField(new Field('name').isDetailLink(true).map(truncate));

        ingredient.listView()
            .title('All ingredients') // default title is "[Entity_name] list"
            .pagination(pagination)
            .addField(new Field('id').label('ID'))
            .addField(new Field('name')) // the default list field type is "string", and displays as a string
            .listActions(['show', 'edit', 'delete']);

        ingredient.showView() // a showView displays one entry in full page - allows to display more data than in a a list
            .addField(new Field('id'))
            .addField(new Field('name'));

        ingredient.creationView()
            .addField(new Field('name')); // the default edit field type is "string", and displays as a text input
            
        ingredient.editionView()
            .title('Edit ingredient "{{ entry.values.name }}"') // title() accepts a template string, which has access to the entry
            .actions(['list', 'show', 'delete']) // choose which buttons appear in the action bar
            .addField(new Field('name').validation({"required": true, "maxlength": 100})) // add validation rules for fields
            ;

        nutrient.menuView()
            .order(3)
            .icon('<span class="glyphicon glyphicon-tags"></span>');

        nutrient.dashboardView()
            .title('Nutrients')
            .order(3)
            .limit(10)
            .pagination(pagination)
            .addField(new Field('id').label('ID'))
            .addField(new Field('name'));

        nutrient.listView()
            .infinitePagination(false) // by default, the list view uses infinite pagination. Set to false to use regulat pagination
            .pagination(pagination)
            .addField(new Field('id').label('ID'))
            .addField(new Field('name'));

        NgAdminConfigurationProvider.configure(app);
    });
}());
