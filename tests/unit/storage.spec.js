/*jslint node: true, nomen: true, white: true, unparam: true*/
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
					value: 'this is the value',
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
		describe('When validator is not generating errors', function () {
			var storage, driver, validator, repository, returnValue;
			beforeEach(function () {
				driver = require('./_mock/storageDriver');
				storage = storageInterface(driver({
					value: 'this is the value',
					keys: [ 'key1', 'key2'],
					all: { key1: 'This is key1', key2: 'This is key2' }
				}));
				validator = require('./_mock/validator')();
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
			var storage, driver, validator, repository, error, returnValue;
			beforeEach(function () {
				driver = require('./_mock/storageDriver');
				storage = storageInterface(driver({
					value: 'this is the value',
					keys: [ 'key1', 'key2'],
					all: { key1: 'This is key1', key2: 'This is key2' }
				}));
				error = new Error('This is the error');
				validator = require('./_mock/validator')(error);
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
				it('Calls the callback with error', function () {
					expect(callbackSpy).toHaveBeenCalledWith(error);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Returns the repository instance for chaining', function () {
					expect(returnValue).toBe(repository);
				});
			});
		});
		describe('When driver is not generating errors', function () {
			var storage, driver, repository, returnValue;
			beforeEach(function () {
				driver = require('./_mock/storageDriver');
				storage = storageInterface(driver({
					value: 'this is the value',
					keys: [ 'key1', 'key2'],
					all: { key1: 'This is key1', key2: 'This is key2' }
				}));
				repository = storage.define('test-type');
			});
			describe('When set() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(repository, 'emit');
					callbackSpy = jasmine.createSpy('set callback');
					returnValue = repository.set('test-key', 'this is the value', callbackSpy);
				});
				it('Calls set() on the driver', function () {
					expect(callbackSpy).toHaveBeenCalledWith(undefined);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits a "set" event', function () {
					expect(repository.emit).toHaveBeenCalledWith('set', 'test-type', 'test-key', 'this is the value');
					expect(repository.emit.callCount).toBe(1);
				});
				it('Returns the repository instance for chaining', function () {
					expect(returnValue).toBe(repository);
				});
			});
			describe('When get() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(repository, 'emit');
					callbackSpy = jasmine.createSpy('get callback');
					returnValue = repository.get('test-key', callbackSpy);
				});
				it('Calls get() on the driver', function () {
					expect(callbackSpy).toHaveBeenCalledWith(undefined, 'this is the value');
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits a "get" event', function () {
					expect(repository.emit).toHaveBeenCalledWith('get', 'test-type', 'test-key', 'this is the value');
					expect(repository.emit.callCount).toBe(1);
				});
				it('Returns the repository instance for chaining', function () {
					expect(returnValue).toBe(repository);
				});
			});
			describe('When keys() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(repository, 'emit');
					callbackSpy = jasmine.createSpy('keys callback');
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
				beforeEach(function () {
					spyOn(repository, 'emit');
					callbackSpy = jasmine.createSpy('all callback');
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
				beforeEach(function () {
					spyOn(repository, 'emit');
					callbackSpy = jasmine.createSpy('remove callback');
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
				beforeEach(function () {
					spyOn(repository, 'emit');
					callbackSpy = jasmine.createSpy('set callback');
					returnValue = repository.set('test-key', 'this is the value', callbackSpy);
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
				beforeEach(function () {
					spyOn(repository, 'emit');
					callbackSpy = jasmine.createSpy('get callback');
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
				beforeEach(function () {
					spyOn(repository, 'emit');
					callbackSpy = jasmine.createSpy('keys callback');
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
				beforeEach(function () {
					spyOn(repository, 'emit');
					callbackSpy = jasmine.createSpy('all callback');
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
				beforeEach(function () {
					spyOn(repository, 'emit');
					callbackSpy = jasmine.createSpy('remove callback');
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
		});
	});
}(require('lodash'), require('../../lib/storage'), require('jasmine-node')));
