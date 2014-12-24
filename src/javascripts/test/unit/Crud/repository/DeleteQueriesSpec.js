/*global define,jasmine,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var DeleteQueries = require('ng-admin/Crud/repository/DeleteQueries'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        config,
        entity,
        view;

    describe("Service: DeleteQueries", function () {

        beforeEach(function () {
            config = function () {
                return {
                    baseApiUrl: angular.noop
                };
            };

            entity = new Entity('cat');
            view = entity.creationView()
                .addField(new Field('id').identifier(true))
                .addField(new Field('name').type('text'))
                .extraParams(null)
                .interceptor(null);
        });

        describe("deleteOne", function () {
            it('should DELETE an entity when calling deleteone', function () {
                var deleteQueries = new DeleteQueries({}, Restangular, config);

                deleteQueries.deleteOne(view, 1)
                    .then(function () {
                        expect(Restangular.one).toHaveBeenCalledWith('cat', 1);
                        expect(Restangular.remove).toHaveBeenCalledWith(null, {});
                    });
            });
        });
    });
});
