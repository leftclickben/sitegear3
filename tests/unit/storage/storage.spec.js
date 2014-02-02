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
			var storage, driver, collection, returnValue;
			beforeEach(function () {
				driver = require('../_mock/storageDriver');
				storage = storageInterface(driver());
				collection = storage.collection('test-type');
			});
			describe('When set() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(collection, 'emit');
					callbackSpy = jasmine.createSpy('set callback');
					returnValue = collection.set('test-key', 'this is the value', callbackSpy);
				});
				it('Calls set() on the driver', function () {
					expect(callbackSpy).toHaveBeenCalledWith(undefined);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits a "set" event', function () {
					expect(collection.emit).toHaveBeenCalledWith('set', 'test-type', 'test-key', 'this is the value');
					expect(collection.emit.callCount).toBe(1);
				});
				it('Returns the collection instance for chaining', function () {
					expect(returnValue).toBe(collection);
				});
			});
			describe('When get() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(collection, 'emit');
					callbackSpy = jasmine.createSpy('get callback');
					returnValue = collection.get('test-key', callbackSpy);
				});
				it('Calls get() on the driver', function () {
					expect(callbackSpy).toHaveBeenCalledWith(undefined, 'this is the value');
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits a "get" event', function () {
					expect(collection.emit).toHaveBeenCalledWith('get', 'test-type', 'test-key', 'this is the value');
					expect(collection.emit.callCount).toBe(1);
				});
				it('Returns the collection instance for chaining', function () {
					expect(returnValue).toBe(collection);
				});
			});
			describe('When keys() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(collection, 'emit');
					callbackSpy = jasmine.createSpy('keys callback');
					returnValue = collection.keys(callbackSpy);
				});
				it('Calls keys() on the driver', function () {
					expect(callbackSpy).toHaveBeenCalledWith(undefined, [ 'key1', 'key2' ]);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits a "keys" event', function () {
					expect(collection.emit).toHaveBeenCalledWith('keys', 'test-type', null, [ 'key1', 'key2' ]);
					expect(collection.emit.callCount).toBe(1);
				});
				it('Returns the collection instance for chaining', function () {
					expect(returnValue).toBe(collection);
				});
			});
			describe('When remove() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(collection, 'emit');
					callbackSpy = jasmine.createSpy('remove callback');
					returnValue = collection.remove('test-key', callbackSpy);
				});
				it('Calls remove() on the driver', function () {
					expect(callbackSpy).toHaveBeenCalledWith(undefined);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits a "remove" event', function () {
					expect(collection.emit).toHaveBeenCalledWith('remove', 'test-type', 'test-key');
					expect(collection.emit.callCount).toBe(1);
				});
				it('Returns the collection instance for chaining', function () {
					expect(returnValue).toBe(collection);
				});
			});
		});
		describe('When driver is generating errors', function () {
			var storage, driver, collection, returnValue,
				error = new Error('something went wrong');
			beforeEach(function () {
				driver = require('../_mock/storageDriverWithErrors');
				storage = storageInterface(driver({ error: error }));
				collection = storage.collection('test-type');
			});
			describe('When set() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(collection, 'emit');
					callbackSpy = jasmine.createSpy('set callback');
					returnValue = collection.set('test-key', 'this is the value', callbackSpy);
				});
				it('Calls set() on the driver, passing an error', function () {
					expect(callbackSpy).toHaveBeenCalledWith(error);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits an "error" event', function () {
					expect(collection.emit).toHaveBeenCalledWith('error', error);
					expect(collection.emit.callCount).toBe(1);
				});
				it('Returns the collection instance for chaining', function () {
					expect(returnValue).toBe(collection);
				});
			});
			describe('When get() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(collection, 'emit');
					callbackSpy = jasmine.createSpy('get callback');
					returnValue = collection.get('test-key', callbackSpy);
				});
				it('Calls get() on the driver, passing an error', function () {
					expect(callbackSpy).toHaveBeenCalledWith(error, undefined);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits an "error" event', function () {
					expect(collection.emit).toHaveBeenCalledWith('error', error);
					expect(collection.emit.callCount).toBe(1);
				});
				it('Returns the collection instance for chaining', function () {
					expect(returnValue).toBe(collection);
				});
			});
			describe('When keys() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(collection, 'emit');
					callbackSpy = jasmine.createSpy('keys callback');
					returnValue = collection.keys(callbackSpy);
				});
				it('Calls keys() on the driver', function () {
					expect(callbackSpy).toHaveBeenCalledWith(error, undefined);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits a "keys" event', function () {
					expect(collection.emit).toHaveBeenCalledWith('error', error);
					expect(collection.emit.callCount).toBe(1);
				});
				it('Returns the collection instance for chaining', function () {
					expect(returnValue).toBe(collection);
				});
			});
			describe('When remove() is called on the interface', function () {
				var callbackSpy;
				beforeEach(function () {
					spyOn(collection, 'emit');
					callbackSpy = jasmine.createSpy('remove callback');
					returnValue = collection.remove('test-key', callbackSpy);
				});
				it('Calls remove() on the driver, passing an error', function () {
					expect(callbackSpy).toHaveBeenCalledWith(error);
					expect(callbackSpy.callCount).toBe(1);
				});
				it('Emits an "error" event', function () {
					expect(collection.emit).toHaveBeenCalledWith('error', error);
					expect(collection.emit.callCount).toBe(1);
				});
				it('Returns the collection instance for chaining', function () {
					expect(returnValue).toBe(collection);
				});
			});
		});
	});
}(require('lodash'), require('../../../lib/storage'), require('jasmine-node')));
