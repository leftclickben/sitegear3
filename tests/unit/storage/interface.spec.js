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
			var storage, driver, returnValue;
			beforeEach(function () {
				driver = require('../_mock/storageDriver');
				storage = storageInterface(driver());
			});
			describe('When set() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(storage, 'emit');
					callbackSpy = jasmine.createSpy('set callback');
					returnValue = storage.set('test-type', 'test-key', 'this is the value', callbackSpy);
				});
				it('Calls set() on the driver', function () {
					expect(callbackSpy).toHaveBeenCalledWith(undefined);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits a "set" event', function () {
					expect(storage.emit).toHaveBeenCalledWith('set', 'test-type', 'test-key', 'this is the value');
					expect(storage.emit.callCount).toBe(1);
				});
				it('Returns the storage instance for chaining', function () {
					expect(returnValue).toBe(storage);
				});
			});
			describe('When get() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(storage, 'emit');
					callbackSpy = jasmine.createSpy('get callback');
					returnValue = storage.get('test-type', 'test-key', callbackSpy);
				});
				it('Calls get() on the driver', function () {
					expect(callbackSpy).toHaveBeenCalledWith(undefined, 'this is the value');
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits a "get" event', function () {
					expect(storage.emit).toHaveBeenCalledWith('get', 'test-type', 'test-key', 'this is the value');
					expect(storage.emit.callCount).toBe(1);
				});
				it('Returns the storage instance for chaining', function () {
					expect(returnValue).toBe(storage);
				});
			});
			describe('When remove() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(storage, 'emit');
					callbackSpy = jasmine.createSpy('remove callback');
					returnValue = storage.remove('test-type', 'test-key', callbackSpy);
				});
				it('Calls remove() on the driver', function () {
					expect(callbackSpy).toHaveBeenCalledWith(undefined);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits a "remove" event', function () {
					expect(storage.emit).toHaveBeenCalledWith('remove', 'test-type', 'test-key');
					expect(storage.emit.callCount).toBe(1);
				});
				it('Returns the storage instance for chaining', function () {
					expect(returnValue).toBe(storage);
				});
			});
		});
		describe('When driver is generating errors', function () {
			var storage, driver, returnValue,
				error = new Error('something went wrong');
			beforeEach(function () {
				driver = require('../_mock/storageDriverWithErrors');
				storage = storageInterface(driver({ error: error }));
			});
			describe('When set() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(storage, 'emit');
					callbackSpy = jasmine.createSpy('set callback');
					returnValue = storage.set('test-type', 'test-key', 'this is the value', callbackSpy);
				});
				it('Calls set() on the driver, passing an error', function () {
					expect(callbackSpy).toHaveBeenCalledWith(error);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits an "error" event', function () {
					expect(storage.emit).toHaveBeenCalledWith('error', error);
					expect(storage.emit.callCount).toBe(1);
				});
				it('Returns the storage instance for chaining', function () {
					expect(returnValue).toBe(storage);
				});
			});
			describe('When get() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(storage, 'emit');
					callbackSpy = jasmine.createSpy('get callback');
					returnValue = storage.get('test-type', 'test-key', callbackSpy);
				});
				it('Calls get() on the driver, passing an error', function () {
					expect(callbackSpy).toHaveBeenCalledWith(error, undefined);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits an "error" event', function () {
					expect(storage.emit).toHaveBeenCalledWith('error', error);
					expect(storage.emit.callCount).toBe(1);
				});
				it('Returns the storage instance for chaining', function () {
					expect(returnValue).toBe(storage);
				});
			});
			describe('When remove() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(storage, 'emit');
					callbackSpy = jasmine.createSpy('remove callback');
					returnValue = storage.remove('test-type', 'test-key', callbackSpy);
				});
				it('Calls remove() on the driver, passing an error', function () {
					expect(callbackSpy).toHaveBeenCalledWith(error);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits an "error" event', function () {
					expect(storage.emit).toHaveBeenCalledWith('error', error);
					expect(storage.emit.callCount).toBe(1);
				});
				it('Returns the storage instance for chaining', function () {
					expect(returnValue).toBe(storage);
				});
			});
		});
	});
}(require('lodash'), require('../../../lib/storage/interface'), require('jasmine-node')));
