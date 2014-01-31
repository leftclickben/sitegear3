/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, jasmine, fs, path, sitegear3, prepareView) {
	"use strict";
	require('../setupTests');

	describe('Helper: prepareView', function () {
		var app, helper;
		beforeEach(function () {
			app = require('../_mock/app');
			helper = prepareView(app);
		});
		it('Exports a function', function () {
			expect(_.isFunction(helper)).toBeTruthy();
		});
		describe('Operates correctly', function () {
			var mockRequest, mockResponse, next;
			beforeEach(function () {
				mockRequest = require('../_mock/request');
				mockResponse = require('../_mock/response');
				next = jasmine.createSpy('next');
				helper(mockRequest, mockResponse, next);
			});
			it('Sets site info from settings into app.locals', function () {
				expect(app.locals.site.name).toBe(app.get('site name'));
				expect(app.locals.site.url).toBe(app.get('site url'));
			});
			it('Does not set any additional values into app.locals.site', function () {
				expect(_.size(app.locals.site)).toBe(2);
			});
			it('Sets the current date into app.locals', function () {
				expect(Object.getPrototypeOf(app.locals.now)).toBe(Date.prototype);
			});
			it('Loads view helpers and calls next()', function () {
				var name;
				fs.readdir(path.join(__dirname, '..', '..', '..', 'lib', 'viewHelpers'), function (filenames) {
					_.each(filenames, function (filename) {
						if (/\.js$/.test(filename)) {
							name = path.basename(filename, '.js');
							expect(app.locals[name]).toBeDefined();
							expect(_.isFunction(app.locals[name])).toBeTruthy();
						}
					});
				});
			});
			// TODO This doesn't work because of the asynchronous readdir()
//			it('Calls next()', function () {
//				expect(next).toHaveBeenCalled();
//			});
		});
	});
}(require('lodash'), require('jasmine-node'), require('fs'), require('path'), require('../../../index.js'), require('../../../lib/helpers/prepareView')));
