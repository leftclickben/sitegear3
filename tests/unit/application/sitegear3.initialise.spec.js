/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3) {
	"use strict";

	describe('Sitegear3 application lifecycle: initialise()', function () {
		var app;
		describe('With null parameter', function () {
			beforeEach(function () {
				app = sitegear3();
				spyOn(app, 'init').andCallThrough();
				app.initialise();
			});
			it('Calls app.init()', function () {
				expect(app.init).toHaveBeenCalled();
			});
			it('Exposes all defaults as settings', function () {
				expect(app.settings.site.key).toBe('anonymous-website');
				expect(app.settings.site.name).toBe('Anonymous Website');
				expect(app.settings.site.baseUrl).toBe('http://localhost/');
				expect(app.settings.server.port).toBe(80);
				expect(app.settings.session.key).toBe("sitegear3.session");
				expect(app.settings.session.secret).toBe("Sitegear3");
				expect(app.settings.persistence.redis).toBe(true);
				expect(app.settings.controllers.default.page.prefix).toBe("page");
				expect(app.settings.controllers.default.page.separator).toBe(".");
				expect(app.settings.controllers.default.page.blocks.length).toBe(2);
				expect(app.settings.controllers.default.page.blocks[0]).toBe('main');
				expect(app.settings.controllers.default.page.blocks[1]).toBe('title');
			});
			it('Does not expose additional settings', function () {
				expect(app.settings.testKey).toBeUndefined();
				expect(app.settings.site.testKey).toBeUndefined();
				expect(app.settings.site.additionalKey).toBeUndefined();
				expect(app.settings.foo).toBeUndefined();
			});
			it('Loads controllers', function () {
				expect(_.isFunction(app.controllers.default)).toBeTruthy();
				expect(_.size(app.controllers)).toBe(2);
			});
			afterEach(function () {
				app.dispose();
			});
		});
		describe('With object parameter', function () {
			beforeEach(function () {
				app = sitegear3();
				spyOn(app, 'init').andCallThrough();
				app.initialise({ site: { name: 'Test Spec', additionalKey: 'value' }, foo: 'bar' });
			});
			it('Calls app.init()', function () {
				expect(app.init).toHaveBeenCalled();
			});
			it('Applies settings over defaults', function () {
				expect(app.settings.site.name).toBe('Test Spec');
				expect(app.settings.site.additionalKey).toBe('value');
				expect(app.settings.foo).toBe('bar');
			});
			it('Exposes defaults not overridden as settings', function () {
				expect(app.settings.site.key).toBe('anonymous-website');
				expect(app.settings.site.baseUrl).toBe('http://localhost/');
				expect(app.settings.server.port).toBe(80);
				expect(app.settings.session.key).toBe("sitegear3.session");
				expect(app.settings.session.secret).toBe("Sitegear3");
				expect(app.settings.persistence.redis).toBe(true);
				expect(app.settings.controllers.default.page.prefix).toBe("page");
				expect(app.settings.controllers.default.page.separator).toBe(".");
				expect(app.settings.controllers.default.page.blocks.length).toBe(2);
				expect(app.settings.controllers.default.page.blocks[0]).toBe('main');
				expect(app.settings.controllers.default.page.blocks[1]).toBe('title');
			});
			it('Does not expose additional settings', function () {
				expect(app.settings.testKey).toBeUndefined();
				expect(app.settings.site.testKey).toBeUndefined();
			});
			it('Loads controllers', function () {
				expect(_.isFunction(app.controllers.default)).toBeTruthy();
				expect(_.size(app.controllers)).toBe(2);
			});
			afterEach(function () {
				app.dispose();
			});
		});
	});
}(require('lodash'), require('../../../index')));
