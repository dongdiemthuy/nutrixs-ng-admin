/*global define,jasmine,angular,describe,it,expect*/

define(function (require) {
    'use strict';

    var ReferencedList = require('ng-admin/Main/component/service/config/ReferencedList'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        ReferenceMany = require('ng-admin/Main/component/service/config/ReferenceMany'),
        ListView = require('ng-admin/Main/component/service/config/view/ListView'),
        EditView = require('ng-admin/Main/component/service/config/view/EditView'),
        Entity = require('ng-admin/Main/component/service/config/Entity');

    describe("Service: ReferencedList config", function () {

        it('should retrieve referenceMany fields.', function () {
            var referencedList = new ReferencedList('myField'),
                ref1 = new ReferenceMany('ref1'),
                ref2 = new ReferenceMany('ref2');

            referencedList.targetFields([ref1, ref2]);

            var references = referencedList.targetFields();

            expect(references.length).toBe(2);
            expect(references[0].name()).toBe('ref1');
        });

        it('should return information about grid column.', function () {
            var referencedList = new ReferencedList('myField'),
                field1 = new Field('f1').label('Field 1'),
                field2 = new Field('f2').label('Field 2');

            referencedList.targetFields([field1, field2]);

            var columns = referencedList.getGridColumns();

            expect(columns.length).toBe(2);
            expect(columns[0].label).toBe('Field 1');
            expect(columns[1].field.name()).toBe('f2');
        });

        it('should filter entries.', function () {
            var referencedList = new ReferencedList('cats'),
                human = new Entity('human');

            human.editionView()
                .addField(new Field('id'))
                .addField(new Field('human_id'))
                .addField(new Field('name'));

            referencedList
                .targetReferenceField('human_id')
                .setEntries(human.editionView().mapEntries([
                    { id: 1, human_id: 1, name: 'Suna'},
                    { id: 2, human_id: 2, name: 'Boby'},
                    { id: 3, human_id: 1, name: 'Mizute'}
                ]));

            referencedList.filterEntries(1);
            var entries = referencedList.getEntries();

            expect(entries.length).toEqual(2);
            expect(entries[0].values.name).toEqual('Suna');
            expect(entries[1].values.name).toEqual('Mizute');
        });

        it('should store target entity configuration', function () {
            var comment = new Entity('comments');

            var post = new Entity('posts');
            post.editionView()
                .addField(new ReferencedList('comments')
                    .targetEntity(comment)
                    .targetField(new Field('id'))
                );

            expect(post.getViewByType('EditView').getField('comments').targetEntity().listView()).not.toBe(null);
        });

    });
});
