/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, storageInterface, jasmine) {
	"use strict";
	require('../setupTests');

	describe('Storage interface', function () {
		it('Exports a function', function () {
			expect(_.isFunction(storageInterface)).toBeTruthy();
		});
		describe('When driver is not generating errors', function () {
			var storage, driver, repository, returnValue;
			beforeEach(function () {
				driver = require('../_mock/storageDriver');
				storage = storageInterface(driver());
				repository = storage.repository('test-type');
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
				driver = require('../_mock/storageDriverWithErrors');
				storage = storageInterface(driver({ error: error }));
				repository = storage.repository('test-type');
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
}(require('lodash'), require('../../../lib/storage'), require('jasmine-node')));
