/*jslint node: true, nomen: true, white: true, unparam: true, plusplus: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, repository, mockAdapter, mockValidator, jasmine) {
	"use strict";
	require('../setupTests');

	describe('Data: repository', function () {
		var callbackSpy, repo, returnValue,
			newValue = { value: 'this is the new value' },
			error = new Error('something went wrong'),
			errorAdapter = mockAdapter({
				error: error
			}),
			adapter  = mockAdapter({
				value: { value: 'this is the value' },
				keys: [ 'key1', 'key2'],
				all: { key1: { value: 'This is the value' }, key2: { value: 'This is the value' } }
			});
		it('Exports a function', function () {
			expect(_.isFunction(repository)).toBeTruthy();
		});
		describe('Uses adapters correctly', function () {
			describe('When adapter is operating normally', function () {
				beforeEach(function () {
					repo = repository(adapter, 'test-type');
				});
				describe('When set() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'validate').andCallThrough();
						spyOn(repo, 'emit');
						spyOn(adapter, 'set').andCallThrough();
						callbackSpy = jasmine.createSpy('set callback').andCallFake(function () {
							done();
						});
						returnValue = repo.set('test-key', newValue, callbackSpy);
					});
					it('Calls validate() on the repository', function () {
						expect(repo.validate).toHaveBeenCalled();
						expect(repo.validate.callCount).toBe(1);
						expect(repo.validate.mostRecentCall.args.length).toBe(2);
						expect(_.isPlainObject(repo.validate.mostRecentCall.args[0])).toBeTruthy();
						expect(repo.validate.mostRecentCall.args[0].value).toBe('this is the new value');
						expect(_.isFunction(repo.validate.mostRecentCall.args[1])).toBeTruthy();
					});
					it('Calls set() on the adapter', function () {
						expect(adapter.set).toHaveBeenCalled();
						expect(adapter.set.callCount).toBe(1);
					});
					it('Calls the callback', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "set" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('set', 'test-type', 'test-key', newValue);
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
				describe('When get() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'emit');
						spyOn(adapter, 'get').andCallThrough();
						callbackSpy = jasmine.createSpy('get callback').andCallFake(function () {
							done();
						});
						returnValue = repo.get('test-key', callbackSpy);
					});
					it('Calls get() on the adapter', function () {
						expect(adapter.get).toHaveBeenCalled();
						expect(adapter.get.callCount).toBe(1);
					});
					it('Calls the callback', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined, { value: 'this is the value' });
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "get" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('get', 'test-type', 'test-key', { value: 'this is the value' });
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
				describe('When keys() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'emit');
						spyOn(adapter, 'keys').andCallThrough();
						callbackSpy = jasmine.createSpy('keys callback').andCallFake(function () {
							done();
						});
						returnValue = repo.keys(callbackSpy);
					});
					it('Calls keys() on the adapter', function () {
						expect(adapter.keys).toHaveBeenCalled();
						expect(adapter.keys.callCount).toBe(1);
					});
					it('Calls the callback', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined, [ 'key1', 'key2' ]);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "keys" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('keys', 'test-type', null, [ 'key1', 'key2' ]);
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
				describe('When all() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'emit');
						spyOn(adapter, 'all').andCallThrough();
						callbackSpy = jasmine.createSpy('all callback').andCallFake(function () {
							done();
						});
						returnValue = repo.all(callbackSpy);
					});
					it('Calls all() on the adapter', function () {
						expect(adapter.all).toHaveBeenCalled();
						expect(adapter.all.callCount).toBe(1);
					});
					it('Calls the callback', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined, { key1: { value: 'This is the value' }, key2: { value: 'This is the value' } });
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "all" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('all', 'test-type', null, { key1: { value: 'This is the value' }, key2: { value: 'This is the value' } });
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
				describe('When remove() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'emit');
						spyOn(adapter, 'remove').andCallThrough();
						callbackSpy = jasmine.createSpy('remove callback').andCallFake(function () {
							done();
						});
						returnValue = repo.remove('test-key', callbackSpy);
					});
					it('Calls remove() on the adapter', function () {
						expect(adapter.remove).toHaveBeenCalled();
						expect(adapter.remove.callCount).toBe(1);
					});
					it('Calls the callback', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "remove" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('remove', 'test-type', 'test-key');
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
				describe('When clear() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'emit');
						spyOn(adapter, 'clear').andCallThrough();
						callbackSpy = jasmine.createSpy('clear callback').andCallFake(function () {
							done();
						});
						returnValue = repo.clear(callbackSpy);
					});
					it('Calls clear() on the adapter', function () {
						expect(adapter.clear).toHaveBeenCalled();
						expect(adapter.clear.callCount).toBe(1);
					});
					it('Calls the callback', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "clear" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('clear', 'test-type');
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
			});
			describe('When adapter is generating errors', function () {
				beforeEach(function () {
					repo = repository(errorAdapter, 'test-type');
				});
				describe('When set() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'validate').andCallThrough();
						spyOn(repo, 'emit');
						spyOn(errorAdapter, 'set').andCallThrough();
						callbackSpy = jasmine.createSpy('set callback').andCallFake(function () {
							done();
						});
						returnValue = repo.set('test-key', newValue, callbackSpy);
					});
					it('Calls validate() on the repository', function () {
						expect(repo.validate).toHaveBeenCalled();
						expect(repo.validate.callCount).toBe(1);
						expect(repo.validate.mostRecentCall.args.length).toBe(2);
						expect(_.isPlainObject(repo.validate.mostRecentCall.args[0])).toBeTruthy();
						expect(repo.validate.mostRecentCall.args[0].value).toBe('this is the new value');
						expect(_.isFunction(repo.validate.mostRecentCall.args[1])).toBeTruthy();
					});
					it('Calls set() on the adapter, passing an error', function () {
						expect(errorAdapter.set).toHaveBeenCalled();
						expect(errorAdapter.set.callCount).toBe(1);
					});
					it('Calls the callback, passing an error', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits an "error" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('error', error);
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
				describe('When get() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'emit');
						spyOn(errorAdapter, 'get').andCallThrough();
						callbackSpy = jasmine.createSpy('get callback').andCallFake(function () {
							done();
						});
						returnValue = repo.get('test-key', callbackSpy);
					});
					it('Calls get() on the adapter, passing an error', function () {
						expect(errorAdapter.get).toHaveBeenCalled();
						expect(errorAdapter.get.callCount).toBe(1);
					});
					it('Calls the callback, passing an error', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error, undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits an "error" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('error', error);
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
				describe('When keys() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'emit');
						spyOn(errorAdapter, 'keys').andCallThrough();
						callbackSpy = jasmine.createSpy('keys callback').andCallFake(function () {
							done();
						});
						returnValue = repo.keys(callbackSpy);
					});
					it('Calls keys() on the adapter', function () {
						expect(errorAdapter.keys).toHaveBeenCalled();
						expect(errorAdapter.keys.callCount).toBe(1);
					});
					it('Calls the callback, passing an error', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error, undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "keys" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('error', error);
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
				describe('When all() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'emit');
						spyOn(errorAdapter, 'all').andCallThrough();
						callbackSpy = jasmine.createSpy('all callback').andCallFake(function () {
							done();
						});
						returnValue = repo.all(callbackSpy);
					});
					it('Calls all() on the adapter', function () {
						expect(errorAdapter.all).toHaveBeenCalled();
						expect(errorAdapter.all.callCount).toBe(1);
					});
					it('Calls the callback, passing an error', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error, undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "all" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('error', error);
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
				describe('When remove() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'emit');
						spyOn(errorAdapter, 'remove').andCallThrough();
						callbackSpy = jasmine.createSpy('remove callback').andCallFake(function () {
							done();
						});
						returnValue = repo.remove('test-key', callbackSpy);
					});
					it('Calls remove() on the adapter, passing an error', function () {
						expect(errorAdapter.remove).toHaveBeenCalled();
						expect(errorAdapter.remove.callCount).toBe(1);
					});
					it('Calls the callback, passing an error', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits an "error" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('error', error);
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
				describe('When clear() is called on the mediator', function () {
					beforeEach(function (done) {
						spyOn(repo, 'emit');
						spyOn(errorAdapter, 'clear').andCallThrough();
						callbackSpy = jasmine.createSpy('clear callback').andCallFake(function () {
							done();
						});
						returnValue = repo.clear(callbackSpy);
					});
					it('Calls clear() on the adapter, passing an error', function () {
						expect(errorAdapter.clear).toHaveBeenCalled();
						expect(errorAdapter.clear.callCount).toBe(1);
					});
					it('Calls the callback, passing an error', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits an "error" event', function () {
						expect(repo.emit).toHaveBeenCalledWith('error', error);
						expect(repo.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repo);
					});
				});
			});
		});
		describe('Applies model methods', function () {
			var entity;
			beforeEach(function () {
				repo = repository(adapter, 'test-type', {
					foo: function () {
						return 'bar';
					}
				});
			});
			it('Allows model methods to be called on generated entities', function (done) {
				repo.get('test-key', function (error, value) {
					expect(error).toBeUndefined();
					entity = value;
					expect(_.isFunction(entity.foo)).toBeTruthy();
					expect(entity.foo()).toBe('bar');
					done();
				});
			});
		});
		describe('Applies validation correctly', function () {
			describe('When using a single validator', function () {
				var validatorSpy;
				describe('When validator is operating normally', function () {
					beforeEach(function () {
						validatorSpy = jasmine.createSpy('mock validator').andCallFake(function (data, callback) {
							return mockValidator()(data, callback);
						});
						repo = repository(adapter, 'test-type', null, [ validatorSpy ]);
					});
					describe('When validate() is called', function () {
						beforeEach(function (done) {
							callbackSpy = jasmine.createSpy('callback spy').andCallFake(function () {
								done();
							});
							returnValue = repo.validate(newValue, callbackSpy);
						});
						it('Calls the validator', function () {
							expect(validatorSpy).toHaveBeenCalled();
							expect(validatorSpy.callCount).toBe(1);
							expect(validatorSpy.mostRecentCall.args.length).toBe(2);
							expect(_.isPlainObject(validatorSpy.mostRecentCall.args[0])).toBeTruthy();
							expect(validatorSpy.mostRecentCall.args[0].value).toBe('this is the new value');
							expect(_.isFunction(validatorSpy.mostRecentCall.args[1])).toBeTruthy();
						});
						it('Calls the callback with no error', function () {
							expect(callbackSpy).toHaveBeenCalledWith();
							expect(callbackSpy.callCount).toBe(1);
						});
						it('Returns the repository instance for chaining', function () {
							expect(returnValue).toBe(repo);
						});
					});
					describe('When set() is called', function () {
						beforeEach(function (done) {
							callbackSpy = jasmine.createSpy('callback spy').andCallFake(function () {
								done();
							});
							returnValue = repo.set('test-key', newValue, callbackSpy);
						});
						it('Calls the validator', function () {
							expect(validatorSpy).toHaveBeenCalled();
							expect(validatorSpy.callCount).toBe(1);
							expect(validatorSpy.mostRecentCall.args.length).toBe(2);
							expect(_.isPlainObject(validatorSpy.mostRecentCall.args[0])).toBeTruthy();
							expect(validatorSpy.mostRecentCall.args[0].value).toBe('this is the new value');
							expect(_.isFunction(validatorSpy.mostRecentCall.args[1])).toBeTruthy();
						});
					});
				});
				describe('When validator is generating errors', function () {
					beforeEach(function () {
						validatorSpy = jasmine.createSpy('mock validator').andCallFake(function (data, callback) {
							return mockValidator(error)(data, callback);
						});
						repo = repository(adapter, 'test-type', null, [ validatorSpy ]);
					});
					describe('When validate() is called', function () {
						beforeEach(function (done) {
							callbackSpy = jasmine.createSpy('callback spy').andCallFake(function () {
								done();
							});
							returnValue = repo.validate(newValue, callbackSpy);
						});
						it('Calls the validator', function () {
							expect(validatorSpy).toHaveBeenCalled();
							expect(validatorSpy.callCount).toBe(1);
							expect(validatorSpy.mostRecentCall.args.length).toBe(2);
							expect(_.isPlainObject(validatorSpy.mostRecentCall.args[0])).toBeTruthy();
							expect(validatorSpy.mostRecentCall.args[0].value).toBe('this is the new value');
							expect(_.isFunction(validatorSpy.mostRecentCall.args[1])).toBeTruthy();
						});
						it('Calls the callback with error', function () {
							expect(callbackSpy).toHaveBeenCalledWith(error);
							expect(callbackSpy.callCount).toBe(1);
						});
						it('Returns the repository instance for chaining', function () {
							expect(returnValue).toBe(repo);
						});
					});
					describe('When set() is called', function () {
						beforeEach(function (done) {
							callbackSpy = jasmine.createSpy('callback spy').andCallFake(function () {
								done();
							});
							returnValue = repo.set('test-key', newValue, callbackSpy);
						});
						it('Calls the validator', function () {
							expect(validatorSpy).toHaveBeenCalled();
							expect(validatorSpy.callCount).toBe(1);
							expect(validatorSpy.mostRecentCall.args.length).toBe(2);
							expect(_.isPlainObject(validatorSpy.mostRecentCall.args[0])).toBeTruthy();
							expect(validatorSpy.mostRecentCall.args[0].value).toBe('this is the new value');
							expect(_.isFunction(validatorSpy.mostRecentCall.args[1])).toBeTruthy();
						});
					});
				});
			});
			describe('When using multiple validators', function () {
				var validatorSpies;
				beforeEach(function () {
					validatorSpies = [];
				});
				describe('When validator is operating normally', function () {
					beforeEach(function () {
						_.each(_.range(3), function (i) {
							validatorSpies.push(jasmine.createSpy('mock validator').andCallFake(function (data, callback) {
								return mockValidator()(data, callback);
							}));
						});
						repo = repository(adapter, 'test-type', null, validatorSpies);
					});
					describe('When validate() is called', function () {
						beforeEach(function (done) {
							callbackSpy = jasmine.createSpy('callback spy').andCallFake(function () {
								done();
							});
							returnValue = repo.validate(newValue, callbackSpy);
						});
						it('Calls all validators', function () {
							_.each(validatorSpies, function (validator) {
								expect(validator).toHaveBeenCalled();
								expect(validator.callCount).toBe(1);
								expect(validator.mostRecentCall.args.length).toBe(2);
								expect(_.isPlainObject(validator.mostRecentCall.args[0])).toBeTruthy();
								expect(validator.mostRecentCall.args[0].value).toBe('this is the new value');
								expect(_.isFunction(validator.mostRecentCall.args[1])).toBeTruthy();
							});
						});
						it('Calls the callback with no error', function () {
							expect(callbackSpy).toHaveBeenCalledWith();
							expect(callbackSpy.callCount).toBe(1);
						});
						it('Returns the repository instance for chaining', function () {
							expect(returnValue).toBe(repo);
						});
					});
				});
				describe('When validator is generating errors', function () {
					beforeEach(function () {
						_.each(_.range(3), function (i) {
							validatorSpies.push(jasmine.createSpy('mock validator').andCallFake(function (data, callback) {
								return mockValidator(error)(data, callback);
							}));
						});
						repo = repository(adapter, 'test-type', null, validatorSpies);
					});
					describe('When validate() is called', function () {
						beforeEach(function (done) {
							callbackSpy = jasmine.createSpy('callback spy').andCallFake(function () {
								done();
							});
							returnValue = repo.validate(newValue, callbackSpy);
						});
						it('Calls the first validator', function () {
							expect(validatorSpies[0]).toHaveBeenCalled();
							expect(validatorSpies[0].callCount).toBe(1);
							expect(validatorSpies[0].mostRecentCall.args.length).toBe(2);
							expect(_.isPlainObject(validatorSpies[0].mostRecentCall.args[0])).toBeTruthy();
							expect(validatorSpies[0].mostRecentCall.args[0].value).toBe('this is the new value');
							expect(_.isFunction(validatorSpies[0].mostRecentCall.args[1])).toBeTruthy();
						});
						it('Does not call other validators', function () {
							_.each(validatorSpies.slice(1), function (validator) {
								expect(validator).not.toHaveBeenCalled();
							});
						});
						it('Calls the callback with error', function () {
							expect(callbackSpy).toHaveBeenCalledWith(error);
							expect(callbackSpy.callCount).toBe(1);
						});
						it('Returns the repository instance for chaining', function () {
							expect(returnValue).toBe(repo);
						});
					});
				});

			});
		});
	});
}(require('lodash'), require('../../../lib/data/repository'), require('../_mock/data/adapter'), require('../_mock/data/validator'), require('jasmine-node')));
