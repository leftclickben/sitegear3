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
		describe('When called with a valid connector', function () {
			beforeEach(function () {
				sitegear3.connectors = { test: _.noop };
				spyOn(sitegear3.connectors, 'test');
				app = sitegear3().initialise(require('../settings.json')).persistence('test', { foo: 'foo', bar: 'baz' });
			});
			it('Instantiates the data provider', function () {
				expect(app.data).not.toBeUndefined();
			});
			describe('When creating a repository', function () {
				beforeEach(function () {
					app.data.define('test-repository');
				});
				it('Instantiates the specified connectors', function () {
					expect(sitegear3.connectors.test).toHaveBeenCalledWith({ foo: 'foo', bar: 'baz' });
					expect(sitegear3.connectors.test.callCount).toBe(1);
				});
			});
		});
		describe('When called with an unknown connector', function () {
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
				expect(error.message).toBe('Unknown data connector specified: unknown');
			});
		});
		describe('When called with an unknown connector', function () {
			var error;
			beforeEach(function () {
				sitegear3.connectors = { test: 'this should be a function, not a string' };
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
				expect(error.message).toBe('Invalid data connector specified: test');
			});
		});
	});
}(require('lodash'), require('../../../index')));
