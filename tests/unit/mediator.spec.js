/*jslint node: true, nomen: true, white: true, unparam: true, plusplus: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, engine, mockAdapter, mockModel, mockValidator) {
	"use strict";
	require('../setupTests');

	describe('Mediator', function () {
		it('Exports a function', function () {
			expect(_.isFunction(engine)).toBeTruthy();
		});
		describe('Operates correctly', function () {
			var mediator,
				adapter = mockAdapter({
					value: { value: 'this is the value' },
					keys: [ 'key1', 'key2'],
					all: { key1: { value: 'This is the value' }, key2: { value: 'This is the value' } }
				});
			beforeEach(function () {
				mediator = engine(adapter);
			});
			describe('Caches repositories', function () {
				var repository, repository2;
				beforeEach(function () {
					repository = mediator.define('test-type');
					repository2 = mediator.define('test-type-2');
				});
				it('Returns a different repository for each key', function () {
					expect(repository).not.toBe(repository2);
					expect(mediator.repository('test-type')).not.toBe(repository2);
					expect(mediator.repository('test-type-2')).not.toBe(repository);
				});
				it('Returns the same repository from repository() as it did from define(), when passed the same keys', function () {
					expect(mediator.repository('test-type')).toBe(repository);
					expect(mediator.repository('test-type-2')).toBe(repository2);
				});
				it('Throws an error trying to retrieve a repository that has not been created', function () {
					try {
						mediator.repository('does-not-exist');
						expect('This code should not execute').toBeFalsy();
					} catch (e) {
						expect(e.toString()).toBe('Error: Attempting to retrieve unregistered repository "does-not-exist"');
					}
				});
				it('Throws an error trying to create the same repository twice', function () {
					try {
						mediator.define('test-type');
						expect('This code should not execute').toBeFalsy();
					} catch (e) {
						expect(e.toString()).toBe('Error: Repository "test-type" already exists.');
					}
				});
			});
			describe('The define() function', function () {
				var repository, entity;
				it('Does not allow calls with zero arguments', function () {
					try {
						mediator.define();
						expect('this code').toBe('should not execute');
					} catch(e) {
						expect(e.message).toBe('Cannot define() repository without specifying a type name');
					}
				});
				describe('When called with type argument only', function () {
					beforeEach(function () {
						repository = mediator.define('test-type');
					});
					it('Creates a repository', function () {
						expect(_.isObject(repository)).toBeTruthy();
					});
				});
				describe('When called with type argument and model argument', function () {
					beforeEach(function (done) {
						repository = mediator.define('test-type', mockModel());
						repository.get('test-key', function (error, result) {
							entity = result;
							done();
						});
					});
					it('Creates a repository', function () {
						expect(_.isObject(repository)).toBeTruthy();
						expect(_.isFunction(entity.modelMethod)).toBeTruthy();
						expect(entity.modelMethod()).toBe('result');
					});
				});
				describe('When called with type argument and one validator argument', function () {
					beforeEach(function () {
						repository = mediator.define('test-type', mockValidator());
					});
					it('Creates a repository', function () {
						expect(_.isObject(repository)).toBeTruthy();
					});
				});
				describe('When called with type argument and multiple validator arguments', function () {
					beforeEach(function () {
						repository = mediator.define('test-type', mockValidator(), mockValidator(), mockValidator());
					});
					it('Creates a repository', function () {
						expect(_.isObject(repository)).toBeTruthy();
					});
				});
				describe('When called with type argument, model argument and one validator argument', function () {
					beforeEach(function (done) {
						repository = mediator.define('test-type', mockModel());
						repository.get('test-key', function (error, result) {
							entity = result;
							done();
						});
					});
					it('Creates a repository', function () {
						expect(_.isObject(repository)).toBeTruthy();
						expect(_.isFunction(entity.modelMethod)).toBeTruthy();
						expect(entity.modelMethod()).toBe('result');
					});
				});
				describe('When called with type argument, model argument and multiple validator arguments', function () {
					beforeEach(function (done) {
						repository = mediator.define('test-type', mockModel(), mockValidator(), mockValidator(), mockValidator());
						repository.get('test-key', function (error, result) {
							entity = result;
							done();
						});
					});
					it('Creates a repository', function () {
						expect(_.isObject(repository)).toBeTruthy();
						expect(_.isFunction(entity.modelMethod)).toBeTruthy();
						expect(entity.modelMethod()).toBe('result');
					});
				});
			});
		});
	});
}(require('lodash'), require('../../lib/mediator'), require('./_mock/adapter'), require('./_mock/model'), require('./_mock/validator')));
