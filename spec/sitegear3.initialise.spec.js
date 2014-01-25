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
			expect(app.settings.site.baseUrl).toBe('http://localhost/');
			expect(app.settings.foo).toBe('bar');
		});
		it('Loads controllers', function () {
			expect(_.isFunction(app.controllers.default)).toBeTruthy();
			expect(_.size(app.controllers)).toBe(2);
		});
		afterEach(function () {
			app.dispose();
		});
	});
}(require('lodash'), require('../index')));
