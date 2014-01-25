/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, fs, path, prepareView) {
	"use strict";

	describe('Helper: prepareView', function () {
		var app, helper, mockRequest, mockResponse, container;
		beforeEach(function () {
			app = sitegear3().initialise({ site: { name: 'Test Spec' }});
			helper = prepareView(app);
			mockRequest = {};
			mockResponse = {};
			container = {
				next: function () {}
			};
		});
		it('Exports a function', function () {
			expect(_.isFunction(helper)).toBeTruthy();
		});
		describe('Operates correctly', function () {
			beforeEach(function () {
				spyOn(container, 'next');
				helper(mockRequest, mockResponse, container.next);
			});
			it('Sets site info from settings into app.locals', function () {
				expect(_.isObject(app.locals.site)).toBeTruthy();
				expect(app.locals.site.name).toBe('Test Spec');
			});
			it('Sets the current date into app.locals', function () {
				expect(app.locals.now.__proto__).toBe(Date.prototype);
			});
			it('Loads view helpers', function () {
				fs.readdirSync(path.join(__dirname, '..', '..', '..', 'lib', 'viewHelpers'), function (filename) {
					if (/\.js$/.test(filename)) {
						var name = path.basename(filename, '.js');
						expect(app.locals[name]).toBeDefined();
						expect(_.isFunction(app.locals[name])).toBeTruthy();
					}
				});
			});
			it('Calls next()', function () {
				expect(container.next).toHaveBeenCalled();
			});
		});
		afterEach(function () {
			app.dispose();
		});
	});
}(require('lodash'), require('../../../index.js'), require('fs'), require('path'), require('../../../lib/helpers/prepareView')));
