/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, utils) {
	"use strict";
	require('../setupTests');

	describe('Sitegear3 application lifecycle: initialise()', function () {
		var app;
		describe('With no parameters', function () {
			beforeEach(function () {
				app = sitegear3();
				spyOn(app, 'init').andCallThrough();
				app.initialise();
			});
			it('Calls app.init()', function () {
				expect(app.init).toHaveBeenCalled();
				expect(app.init.callCount).toBe(1);
			});
			it('Exposes all defaults as settings', function () {
				expect(app.get('site name')).toBe('Anonymous Website');
				expect(app.get('site url')).toBe('http://localhost/');
				expect(app.get('modules').default.page.prefix).toBe("page");
				expect(app.get('modules').default.page.separator).toBe(".");
				expect(app.get('modules').default.page.blocks.length).toBe(2);
				expect(app.get('modules').default.page.blocks[0]).toBe('main');
				expect(app.get('modules').default.page.blocks[1]).toBe('title');
			});
			it('Does not expose additional settings', function () {
				expect(app.get('testKey')).toBeUndefined();
				expect(app.get('foo')).toBeUndefined();
			});
			it('Loads modules', function () {
				expect(_.isFunction(app.modules.default)).toBeTruthy();
				expect(_.size(app.modules)).toBe(2);
			});
			afterEach(function () {
				app.stop();
			});
		});
		describe('With object parameter', function () {
			var settings = require('../settings.json');
			beforeEach(function () {
				app = sitegear3();
				spyOn(app, 'init').andCallThrough();
				spyOn(utils, 'expandSettings').andCallThrough();
				app.initialise(settings);
			});
			it('Calls app.init()', function () {
				expect(app.init).toHaveBeenCalled();
				expect(app.init.callCount).toBe(1);
			});
			it('Applies settings over defaults', function () {
				expect(app.get('site name')).toBe('Test Spec');
				expect(app.get('foo')).toBe('bar');
			});
			it('Exposes defaults not overridden as settings', function () {
				expect(app.get('site url')).toBe('http://localhost/');
				expect(app.get('modules').default.page.prefix).toBe("page");
				expect(app.get('modules').default.page.separator).toBe(".");
				expect(app.get('modules').default.page.blocks.length).toBe(2);
				expect(app.get('modules').default.page.blocks[0]).toBe('main');
				expect(app.get('modules').default.page.blocks[1]).toBe('title');
			});
			it('Utilises settings expansion', function () {
				expect(utils.expandSettings).toHaveBeenCalled();
				expect(utils.expandSettings.callCount).toBe(5); // includes recursive calls
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
			it('Loads modules', function () {
				expect(_.isFunction(app.modules.default)).toBeTruthy();
				expect(_.size(app.modules)).toBe(2);
			});
			afterEach(function () {
				app.stop();
			});
		});
	});
}(require('lodash'), require('../../../index'), require('../../../lib/utils')));
