/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, storage) {
	"use strict";
	require('../setupTests');

	sitegear3.ready(function () {
		describe('Sitegear3 application lifecycle: persistence()', function () {
			var app;
			beforeEach(function () {
				app = sitegear3().initialise(require('../settings.json'));
			});
			describe('When called with a valid driver', function () {
				beforeEach(function () {
					sitegear3.storageDrivers = { test: _.noop };
					spyOn(sitegear3.storageDrivers, 'test');
					app.persistence('test', { foo: 'foo', bar: 'baz' });
				});
				it('Instantiates the storage interface', function () {
					expect(app.interfaces.storage).not.toBeUndefined();
				});
				it('Instantiates the specified driver', function () {
					expect(sitegear3.storageDrivers.test).toHaveBeenCalledWith({ foo: 'foo', bar: 'baz' });
					expect(sitegear3.storageDrivers.test.callCount).toBe(1);
				});
			});
			describe('When called with an unknown driver', function () {
				var error;
				beforeEach(function () {
					try {
						app.persistence('unknown');
					} catch (e) {
						error = e;
					}
				});
				it('Does not instantiate the storage interface', function () {
					expect(app.interfaces.storage).toBeUndefined();
				});
				it('Throws the relevant exception', function () {
					expect(error).not.toBeUndefined();
					expect(error.message).toBe('Unknown storage driver specified: unknown');
				});
			});
			describe('When called with an unknown driver', function () {
				var error;
				beforeEach(function () {
					sitegear3.storageDrivers = { test: 'this should be a function, not a string' };
					try {
						app.persistence('test');
					} catch (e) {
						error = e;
					}
				});
				it('Does not instantiate the storage interface', function () {
					expect(app.interfaces.storage).toBeUndefined();
				});
				it('Throws the relevant exception', function () {
					expect(error).not.toBeUndefined();
					expect(error.message).toBe('Invalid storage driver specified: test');
				});
			});
		});
	});
}(require('lodash'), require('../../../index'), require('../../../lib/storage/interface')));
