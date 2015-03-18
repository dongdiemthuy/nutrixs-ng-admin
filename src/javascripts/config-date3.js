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
                    var postId = entry.values.postid;

                    $location.path('/edit/posts/' + postId);
                };
            }
        };
    }]);

    app.directive('templateComment', function () {
        return {
            restrict: 'E',
            compile: function (tElement, attrs) {
                tElement.remove();
            }
        }
    });

    app.config(function (NgAdminConfigurationProvider, Application, Entity, Field, Reference, ReferencedList, ReferenceManyObject, ReferenceManyAggregation) {

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

        var app = new Application('ng-admin backend demo') // application main title
            .baseApiUrl('http://localhost:3000/'); // main API endpoint

        // define all entities at the top to allow references between them
        var post = new Entity('posts'); // the API endpoint for posts will be http://localhost:3000/posts/:id

        var comment = new Entity('comments')
            .identifier(new Field('id')); // you can optionally customize the identifier used in the api ('id' by default)

        var tag = new Entity('tags')
            .readOnly(); // a readOnly entity has disabled creation, edition, and deletion views

        // set the application entities
        app
            .addEntity(post)
            .addEntity(tag)
            .addEntity(comment);

        // customize entities and views

        post.menuView()
            .icon('<span class="glyphicon glyphicon-file"></span>'); // customize the entity menu icon

        post.dashboardView()
            .title('Recent posts')
            .order(1) // display the post panel first in the dashboard
            .limit(5) // limit the panel to the 5 latest posts
            .pagination(pagination) // use the custom pagination function to format the API request correctly
            .addField(new Field('title').isDetailLink(true).map(truncate));

        post.listView()
            .title('All posts') // default title is "[Entity_name] list"
            .pagination(pagination)
            .addField(new Field('id').label('ID'))
            .addField(new Field('title')) // the default list field type is "string", and displays as a string
            .listActions(['show', 'edit', 'delete']);

        post.showView() // a showView displays one entry in full page - allows to display more data than in a a list
            .addField(new Field('id'))
            .addField(new Field('title'))
            .addField(new Field('body').type('wysiwyg'))
            //.addField(new Field('nutrients'))
            .addField(new ReferenceManyAggregation('tagIds')
                .targetEntity(tag)
                .targetField(new Field('name'))
                .targetFields([
                    new Field('id'),
                    new Field('name')
                ])
                // .relationFields([
                //     {
                //         name: "description",
                //         label: "Description",
                //         type: "text"
                //     },
                //     {
                //         name: "qty",
                //         label: "Quantity",
                //         type: "number"
                //     },
                //     {
                //         name: "cost",
                //         label: "Cost",
                //         type: "number"
                //     },
                //     {
                //         name: "tax",
                //         label: "Tax",
                //         type: "number",
                //         editable: false
                //     },
                //     {
                //         name: "total",
                //         label: "Total",
                //         type: "expression",
                //         expression: "(1+tax)*cost*qty"
                //     }
                   // ])
                )

            /*
            .addField(new ReferenceManyAggregation('nutrients')
                .targetEntity(tag)
                .targetField(new Field('name'))
                .targetFields([
                    new Field('id'),
                    new Field('name'),
                ])
               )
            */
            .addField(new ReferencedList('comments')
                .targetEntity(comment)
                .targetReferenceField('postid')
                .targetFields([
                    new Field('id'),
                    new Field('body').label('Comment'),
                ])
            );

        post.creationView()
            .addField(new Field('title')) // the default edit field type is "string", and displays as a text input
            .addField(new Field('body').type('wysiwyg')) // overriding the type allows rich text editing for the body

        post.editionView()
            .title('Edit post "{{ entry.values.title }}"') // title() accepts a template string, which has access to the entry
            .actions(['list', 'show', 'delete']) // choose which buttons appear in the action bar
            .addField(new Field('title'))
            .addField(new Field('body').type('wysiwyg'))
            .addField(new ReferenceManyAggregation('tagIds')
                .targetEntity(tag)
                .targetField(new Field('name'))
                .targetFields([
                    new Field('id'),
                    new Field('name')
                ])
                .relationFields([
                    {
                        name: "id",
                        label: "ID",
                        type: "text"
                    },
                    {
                        name: "name",
                        label: "Name",
                        type: "text"
                    },
                    {
                        name: "qty",
                        label: "Quantity",
                        type: "number"
                    },
                    {
                        name: "cost",
                        label: "Cost",
                        type: "number"
                    },
                    {
                        name: "tax",
                        label: "Tax",
                        type: "number",
                        editable: false
                    },
                    {
                        name: "total",
                        label: "Total",
                        type: "expression",
                        expression: "(1+tax)*cost*qty"
                    }
                ])
            )
            .addField(new ReferencedList('comments')
                .targetEntity(comment)
                .targetReferenceField('postid')
                .targetFields([
                    new Field('id'),
                    new Field('body').label('Comment')
                ])
            );

        comment.menuView()
            .order(2) // set the menu position in the sidebar
            .icon('<strong style="font-size:1.3em;line-height:1em">✉</strong>'); // you can even use utf-8 symbols!

        comment.dashboardView()
            .title('Last comments')
            .order(2) // display the comment panel second in the dashboard
            .limit(5)
            .pagination(pagination)
            .addField(new Field('id'))
            .addField(new Field('body').label('Comment').map(truncate))
            .addField(new Field() // template fields don't need a name
                .type('template') // a field which uses a custom template
                .label('Actions')
                .template(function () { // template() can take a function or a string
                    return '<custom-post-link></custom-post-link>'; // you can use custom directives, too
                })
            );

        comment.listView()
            .title('Comments')
            .description('List of all comments with an infinite pagination') // description appears under the title
            .pagination(pagination)
            .addField(new Field('id').label('ID'))
            .addField(new Reference('postid')
                .label('Post title')
                .map(truncate)
                .targetEntity(post)
                .targetField(new Field('title'))
            )
            .addField(new Field('body').map(truncate))
            .addField(new Field('createdat').label('Creation date').type('date'))
            .addQuickFilter('Today', function () { // a quick filter displays a button to filter the list based on a set of query parameters passed to the API
                var now = new Date(),
                    year = now.getFullYear(),
                    month = now.getMonth() + 1,
                    day = now.getDate();
                month = month < 10 ? '0' + month : month;
                day = day < 10 ? '0' + day : day;
                return {
                    createdat: [year, month, day].join('-') // ?createdat=... will be appended to the API call
                };
            });

        comment.creationView()
            .addField(new Reference('postid')
                .label('Post title')
                .map(truncate)
                .targetEntity(post)
                .targetField(new Field('title'))
            )
            .addField(new Field('body').type('wysiwyg'))
            .addField(new Field('createdat')
                .label('Creation date')
                .type('date') // to edit a date type field, ng-admin offers a datepicker
                .defaultValue(new Date()) // preset fields in creation view with defaultValue
            );

        comment.editionView()
            .addField(new Reference('postid')
                .label('Post title')
                .map(truncate)
                .targetEntity(post)
                .targetField(new Field('title'))
            )
            .addField(new Field('body').type('wysiwyg'))
            .addField(new Field('createdat').label('Creation date').type('date'))
            .addField(new Field()
                .type('template')
                .label('Actions')
                .template('<custom-post-link></custom-post-link>') // template() can take a function or a string
            );

        comment.deletionView()
            .title('Deletion confirmation'); // customize the deletion confirmation message

        tag.menuView()
            .order(3)
            .icon('<span class="glyphicon glyphicon-tags"></span>');

        tag.dashboardView()
            .title('Recent tags')
            .order(3)
            .limit(10)
            .pagination(pagination)
            .addField(new Field('id').label('ID'))
            .addField(new Field('name'))
            .addField(new Field('published').label('Is published ?').type('boolean'));

        tag.listView()
            .infinitePagination(false) // by default, the list view uses infinite pagination. Set to false to use regulat pagination
            .pagination(pagination)
            .addField(new Field('id').label('ID'))
            .addField(new Field('name'))
            .addField(new Field('published').type('boolean'))
            .addField(new Field('custom')
                .type('template')
                .label('Upper name')
                .template('{{ entry.values.name.toUpperCase() }}')
            )
            .listActions(['show']);

        tag.showView()
            .addField(new Field('name'))
            .addField(new Field('published').type('boolean'));

        NgAdminConfigurationProvider.configure(app);
    });
}());
