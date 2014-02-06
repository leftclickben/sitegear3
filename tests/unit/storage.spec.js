/*jslint node: true, nomen: true, white: true, unparam: true, plusplus: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, storageInterface, jasmine) {
	"use strict";
	require('./setupTests');

	describe('Storage interface', function () {
		it('Exports a function', function () {
			expect(_.isFunction(storageInterface)).toBeTruthy();
		});
		describe('Caches repositories', function () {
			var storage, driver, repository, repository2;
			beforeEach(function () {
				driver = require('./_mock/storageDriver');
				storage = storageInterface(driver({
					value: { value: 'this is the value' },
					keys: [ 'key1', 'key2'],
					all: { key1: 'This is key1', key2: 'This is key2' }
				}));
				repository = storage.define('test-type');
				repository2 = storage.define('test-type-2');
			});
			it('Returns a different repository for each key', function () {
				expect(repository).not.toBe(repository2);
				expect(storage.repository('test-type')).not.toBe(repository2);
				expect(storage.repository('test-type-2')).not.toBe(repository);
			});
			it('Returns the same repository from repository() as it did from define(), when passed the same keys', function () {
				expect(storage.repository('test-type')).toBe(repository);
				expect(storage.repository('test-type-2')).toBe(repository2);
			});
			it('Throws an error trying to retrieve a repository that has not been created', function () {
				try {
					storage.repository('does-not-exist');
					expect('This code should not execute').toBeFalsy();
				} catch (error) {
					expect(error.toString()).toBe('Error: Attempting to retrieve unregistered repository "does-not-exist"');
				}
			});
			it('Throws an error trying to create the same repository twice', function () {
				try {
					storage.define('test-type');
					expect('This code should not execute').toBeFalsy();
				} catch (error) {
					expect(error.toString()).toBe('Error: Repository "test-type" already exists.');
				}
			});
		});
		describe('Uses drivers correctly', function () {
			describe('When driver is not generating errors', function () {
				var storage, driver, repository, returnValue;
				beforeEach(function () {
					driver = require('./_mock/storageDriver');
					storage = storageInterface(driver({
						value: { value: 'this is the value' },
						keys: [ 'key1', 'key2'],
						all: { key1: 'This is key1', key2: 'This is key2' }
					}));
					repository = storage.define('test-type');
				});
				describe('When set() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('set callback').andCallFake(function () {
							done();
						});
						returnValue = repository.set('test-key', { value: 'this is the new value' }, callbackSpy);
					});
					it('Calls set() on the driver', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "set" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('set', 'test-type', 'test-key', { value: 'this is the new value' });
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
				describe('When get() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('get callback').andCallFake(function () {
							done();
						});
						returnValue = repository.get('test-key', callbackSpy);
					});
					it('Calls get() on the driver', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined, { value: 'this is the value' });
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "get" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('get', 'test-type', 'test-key', { value: 'this is the value' });
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
				describe('When keys() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('keys callback').andCallFake(function () {
							done();
						});
						returnValue = repository.keys(callbackSpy);
					});
					it('Calls keys() on the driver', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined, [ 'key1', 'key2' ]);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "keys" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('keys', 'test-type', null, [ 'key1', 'key2' ]);
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
				describe('When all() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('all callback').andCallFake(function () {
							done();
						});
						returnValue = repository.all(callbackSpy);
					});
					it('Calls all() on the driver', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined, { key1: 'This is key1', key2: 'This is key2' });
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "all" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('all', 'test-type', null, { key1: 'This is key1', key2: 'This is key2' });
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
				describe('When remove() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('remove callback').andCallFake(function () {
							done();
						});
						returnValue = repository.remove('test-key', callbackSpy);
					});
					it('Calls remove() on the driver', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "remove" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('remove', 'test-type', 'test-key');
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
				describe('When clear() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('clear callback').andCallFake(function () {
							done();
						});
						returnValue = repository.clear(callbackSpy);
					});
					it('Calls clear() on the driver', function () {
						expect(callbackSpy).toHaveBeenCalledWith(undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "clear" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('clear', 'test-type');
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
			});
			describe('When driver is generating errors', function () {
				var storage, driver, repository, returnValue,
					error = new Error('something went wrong');
				beforeEach(function () {
					driver = require('./_mock/storageDriver');
					storage = storageInterface(driver({ error: error }));
					repository = storage.define('test-type');
				});
				describe('When set() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('set callback').andCallFake(function () {
							done();
						});
						returnValue = repository.set('test-key', { value: 'this is the new value' }, callbackSpy);
					});
					it('Calls set() on the driver, passing an error', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits an "error" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('error', error);
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
				describe('When get() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('get callback').andCallFake(function () {
							done();
						});
						returnValue = repository.get('test-key', callbackSpy);
					});
					it('Calls get() on the driver, passing an error', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error, undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits an "error" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('error', error);
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
				describe('When keys() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('keys callback').andCallFake(function () {
							done();
						});
						returnValue = repository.keys(callbackSpy);
					});
					it('Calls keys() on the driver', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error, undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "keys" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('error', error);
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
				describe('When all() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('all callback').andCallFake(function () {
							done();
						});
						returnValue = repository.all(callbackSpy);
					});
					it('Calls all() on the driver', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error, undefined);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits a "all" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('error', error);
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
				describe('When remove() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('remove callback').andCallFake(function () {
							done();
						});
						returnValue = repository.remove('test-key', callbackSpy);
					});
					it('Calls remove() on the driver, passing an error', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits an "error" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('error', error);
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
				describe('When clear() is called on the interface', function () {
					var callbackSpy;
					beforeEach(function (done) {
						spyOn(repository, 'emit');
						callbackSpy = jasmine.createSpy('clear callback').andCallFake(function () {
							done();
						});
						returnValue = repository.remove('test-key', callbackSpy);
					});
					it('Calls clear() on the driver, passing an error', function () {
						expect(callbackSpy).toHaveBeenCalledWith(error);
						expect(callbackSpy.callCount).toBe(1);
					});
					it('Emits an "error" event', function () {
						expect(repository.emit).toHaveBeenCalledWith('error', error);
						expect(repository.emit.callCount).toBe(1);
					});
					it('Returns the repository instance for chaining', function () {
						expect(returnValue).toBe(repository);
					});
				});
			});
		});
		describe('Applies validation correctly', function () {
			var storage, driver, repository, returnValue, error,
				data = { some: 'data' };
			describe('When using a single validator', function () {
				var mockValidator, validator;
				beforeEach(function () {
					driver = require('./_mock/storageDriver');
					storage = storageInterface(driver({
						value: { value: 'this is the value' },
						keys: [ 'key1', 'key2'],
						all: { key1: 'This is key1', key2: 'This is key2' }
					}));
				});
				describe('When validator is not generating errors', function () {
					beforeEach(function () {
						mockValidator = require('./_mock/validator')();
						validator = jasmine.createSpy('mock validator').andCallFake(function (data, callback) {
							return mockValidator(data, callback);
						});
						repository = storage.define('test-type', validator);
					});
					describe('When validate() is called', function () {
						var callbackSpy;
						beforeEach(function (done) {
							callbackSpy = jasmine.createSpy('callback spy').andCallFake(function () {
								done();
							});
							returnValue = repository.validate(data, callbackSpy);
						});
						it('Calls the validator', function () {
							expect(validator).toHaveBeenCalled();
							expect(validator.callCount).toBe(1);
							expect(validator.mostRecentCall.args.length).toBe(2);
							expect(_.isPlainObject(validator.mostRecentCall.args[0])).toBeTruthy();
							expect(validator.mostRecentCall.args[0].some).toBe('data');
							expect(_.isFunction(validator.mostRecentCall.args[1])).toBeTruthy();
						});
						it('Calls the callback with no error', function () {
							expect(callbackSpy).toHaveBeenCalledWith();
							expect(callbackSpy.callCount).toBe(1);
						});
						it('Returns the repository instance for chaining', function () {
							expect(returnValue).toBe(repository);
						});
					});
				});
				describe('When validator is generating errors', function () {
					beforeEach(function () {
						error = new Error('This is the error');
						mockValidator = require('./_mock/validator')(error);
						validator = jasmine.createSpy('mock validator').andCallFake(function (data, callback) {
							return mockValidator(data, callback);
						});
						repository = storage.define('test-type', validator);
					});
					describe('When validate() is called', function () {
						var callbackSpy;
						beforeEach(function (done) {
							callbackSpy = jasmine.createSpy('callback spy').andCallFake(function () {
								done();
							});
							returnValue = repository.validate({ some: 'data' }, callbackSpy);
						});
						it('Calls the validator', function () {
							expect(validator).toHaveBeenCalled();
							expect(validator.callCount).toBe(1);
							expect(validator.mostRecentCall.args.length).toBe(2);
							expect(_.isPlainObject(validator.mostRecentCall.args[0])).toBeTruthy();
							expect(validator.mostRecentCall.args[0].some).toBe('data');
							expect(_.isFunction(validator.mostRecentCall.args[1])).toBeTruthy();
						});
						it('Calls the callback with error', function () {
							expect(callbackSpy).toHaveBeenCalledWith(error);
							expect(callbackSpy.callCount).toBe(1);
						});
						it('Returns the repository instance for chaining', function () {
							expect(returnValue).toBe(repository);
						});
					});
				});
			});
			describe('When using multiple validators', function () {
				var mockValidators, validators;
				beforeEach(function () {
					driver = require('./_mock/storageDriver');
					storage = storageInterface(driver({
						value: { value: 'this is the value' },
						keys: [ 'key1', 'key2'],
						all: { key1: 'This is key1', key2: 'This is key2' }
					}));
					mockValidators = [];
					validators = [];
				});
				describe('When validator is not generating errors', function () {
					beforeEach(function () {
						_.each(_.range(3), function (i) {
							mockValidators.push(require('./_mock/validator')());
							validators.push(jasmine.createSpy('mock validator').andCallFake(function (data, callback) {
								return mockValidators[i](data, callback);
							}));
						});
						repository = storage.define.apply(storage, [ 'test-type' ].concat(validators));
					});
					describe('When validate() is called', function () {
						var callbackSpy;
						beforeEach(function (done) {
							callbackSpy = jasmine.createSpy('callback spy').andCallFake(function () {
								done();
							});
							returnValue = repository.validate(data, callbackSpy);
						});
						it('Calls all validators', function () {
							_.each(validators, function (validator) {
								expect(validator).toHaveBeenCalled();
								expect(validator.callCount).toBe(1);
								expect(validator.mostRecentCall.args.length).toBe(2);
								expect(_.isPlainObject(validator.mostRecentCall.args[0])).toBeTruthy();
								expect(validator.mostRecentCall.args[0].some).toBe('data');
								expect(_.isFunction(validator.mostRecentCall.args[1])).toBeTruthy();
							});
						});
						it('Calls the callback with no error', function () {
							expect(callbackSpy).toHaveBeenCalledWith();
							expect(callbackSpy.callCount).toBe(1);
						});
						it('Returns the repository instance for chaining', function () {
							expect(returnValue).toBe(repository);
						});
					});
				});
				describe('When validator is generating errors', function () {
					beforeEach(function () {
						error = new Error('This is the error');
						_.each(_.range(3), function (i) {
							mockValidators.push(require('./_mock/validator')(error));
							validators.push(jasmine.createSpy('mock validator').andCallFake(function (data, callback) {
								return mockValidators[i](data, callback);
							}));
						});
						repository = storage.define('test-type', validators[0], validators[1], validators[2]);
					});
					describe('When validate() is called', function () {
						var callbackSpy;
						beforeEach(function (done) {
							callbackSpy = jasmine.createSpy('callback spy').andCallFake(function () {
								done();
							});
							returnValue = repository.validate({ some: 'data' }, callbackSpy);
						});
						it('Calls the first validator', function () {
							expect(validators[0]).toHaveBeenCalled();
							expect(validators[0].callCount).toBe(1);
							expect(validators[0].mostRecentCall.args.length).toBe(2);
							expect(_.isPlainObject(validators[0].mostRecentCall.args[0])).toBeTruthy();
							expect(validators[0].mostRecentCall.args[0].some).toBe('data');
							expect(_.isFunction(validators[0].mostRecentCall.args[1])).toBeTruthy();
						});
						it('Does not call other validators', function () {
							_.each(validators.slice(1), function (validator) {
								expect(validator).not.toHaveBeenCalled();
							});
						});
						it('Calls the callback with error', function () {
							expect(callbackSpy).toHaveBeenCalledWith(error);
							expect(callbackSpy.callCount).toBe(1);
						});
						it('Returns the repository instance for chaining', function () {
							expect(returnValue).toBe(repository);
						});
					});
				});

			});
		});
	});
}(require('lodash'), require('../../lib/storage'), require('jasmine-node')));
