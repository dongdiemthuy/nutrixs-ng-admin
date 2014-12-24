/*global define,jasmine,angular,describe,it,expect,beforeEach*/

define(function (require) {
    'use strict';

    var CreateQueries = require('ng-admin/Crud/repository/CreateQueries'),
        Field = require('ng-admin/Main/component/service/config/Field'),
        Entity = require('ng-admin/Main/component/service/config/Entity'),
        Restangular = require('mock/Restangular'),
        mixins = require('mixins'),
        config,
        entity,
        view;

    describe("Service: CreateQueries", function () {

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

        describe("createOne", function () {

            it('should POST an entity when calling createOne', function () {
                var createQueries = new CreateQueries({}, Restangular, config),
                    rawEntity = {name: 'Mizu'};

                Restangular.post = jasmine.createSpy('post').andReturn(mixins.buildPromise({data: rawEntity}));

                createQueries.createOne(view, rawEntity)
                    .then(function (entry) {
                        expect(Restangular.restangularizeElement).toHaveBeenCalledWith(null, rawEntity, 'cat');
                        expect(Restangular.post).toHaveBeenCalledWith(null, rawEntity, null, {});
                        expect(entry.values.name).toEqual('Mizu');
                    });
            });
        });
    });
});
