/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3) {
	"use strict";
	require('../setupTests');

	describe('Application lifecycle: persistence()', function () {
		var app;
		beforeEach(function (done) {
			sitegear3.ready(done);
		});
		describe('When called with a valid driver', function () {
			beforeEach(function () {
				sitegear3.drivers = { test: _.noop };
				spyOn(sitegear3.drivers, 'test');
				app = sitegear3().initialise(require('../settings.json')).persistence('test', { foo: 'foo', bar: 'baz' });
			});
			it('Instantiates the data provider', function () {
				expect(app.data).not.toBeUndefined();
			});
			describe('When creating a repository', function () {
				beforeEach(function () {
					app.data.define('test-repository');
				});
				it('Instantiates the specified driver', function () {
					expect(sitegear3.drivers.test).toHaveBeenCalledWith({ foo: 'foo', bar: 'baz' });
					expect(sitegear3.drivers.test.callCount).toBe(1);
				});
			});
		});
		describe('When called with an unknown driver', function () {
			var error;
			beforeEach(function () {
				app = sitegear3().initialise(require('../settings.json'));
				try {
					app.persistence('unknown');
				} catch (e) {
					error = e;
				}
			});
			it('Does not instantiate the data provider', function () {
				expect(app.data).toBeUndefined();
			});
			it('Throws the relevant exception', function () {
				expect(error).not.toBeUndefined();
				expect(error.message).toBe('Unknown data driver specified: unknown');
			});
		});
		describe('When called with an unknown driver', function () {
			var error;
			beforeEach(function () {
				sitegear3.drivers = { test: 'this should be a function, not a string' };
				app = sitegear3().initialise(require('../settings.json'));
				try {
					app.persistence('test');
				} catch (e) {
					error = e;
				}
			});
			it('Does not instantiate the data interface', function () {
				expect(app.data).toBeUndefined();
			});
			it('Throws the relevant exception', function () {
				expect(error).not.toBeUndefined();
				expect(error.message).toBe('Invalid data driver specified: test');
			});
		});
	});
}(require('lodash'), require('../../../index')));
