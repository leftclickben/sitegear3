/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, utils) {
	"use strict";
	require('../../setupTests');

	describe('Application lifecycle: initialise()', function () {
		var app;
		describe('With no parameters', function () {
			beforeEach(function () {
				app = sitegear3();
			});
			it('Exposes all defaults as settings', function () {
				expect(app.get('site name')).toBe('Anonymous Website');
				expect(app.get('http url')).toBe('http://localhost/');
				expect(app.get('https url')).toBe('https://localhost/');
			});
			it('Does not expose additional settings', function () {
				expect(app.get('testKey')).toBeUndefined();
				expect(app.get('foo')).toBeUndefined();
			});
			afterEach(function () {
				app.stop();
			});
		});
		describe('With object parameter', function () {
			var originalExpandSettings,
				settings = require('../settings.json');
			beforeEach(function () {
				originalExpandSettings = utils.expandSettings;
				spyOn(utils, 'expandSettings').andCallThrough();
				app = sitegear3(settings);
			});
			it('Applies settings over defaults', function () {
				expect(app.get('site name')).toBe('Test Spec');
				expect(app.get('foo')).toBe('bar');
			});
			it('Exposes defaults not overridden as settings', function () {
				expect(app.get('http url')).toBe('http://localhost/');
				expect(app.get('https url')).toBe('https://localhost/');
			});
			it('Utilises settings expansion', function () {
				expect(utils.expandSettings).toHaveBeenCalled();
				expect(utils.expandSettings.callCount).toBe(1);
				expect(app.get('expando')).toBe('bar');
				expect(app.get('expando2')).toBe('bar');
				expect(app.get('expando3')).toBe('prefix-bar');
				expect(app.get('expando4')).toBe('bar-suffix');
				expect(app.get('expando5')).toBe('prefix-bar-suffix');
				expect(app.get('expando6')).toBeNull();
			});
			it('Does not expose additional settings', function () {
				expect(app.get('testKey')).toBeUndefined();
			});
			afterEach(function () {
				app.stop();
				utils.expandSettings = originalExpandSettings;
			});
		});
	});
}(require('lodash'), require('../../../'), require('../../../lib/utils')));
