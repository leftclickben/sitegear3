/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, jasmine, fs, path, prepareView, mockApplication) {
	"use strict";
	require('../../setupTests');

	describe('Helper: prepareView', function () {
		var app, helper;
		beforeEach(function () {
			app = mockApplication();
			helper = prepareView(app);
		});
		it('Exports a function', function () {
			expect(_.isFunction(helper)).toBeTruthy();
		});
		describe('By default', function () {
			var mockRequest, mockResponse, next;
			beforeEach(function (done) {
				mockRequest = require('../_mock/request');
				mockResponse = require('../_mock/response');
				next = jasmine.createSpy('next');
				helper(mockRequest, mockResponse, function () {
					next();
					done();
				});
			});
			it('Sets site info from settings into app.locals', function () {
				expect(app.locals.siteName).toBe(app.get('site name'));
				expect(app.locals.baseUrl).toBe(app.get('http url'));
			});
			it('Sets the current date into app.locals', function () {
				expect(Object.getPrototypeOf(app.locals.now)).toBe(Date.prototype);
			});
			it('Loads view helpers', function () {
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
			it('Calls next()', function () {
				expect(next).toHaveBeenCalled();
			});
		});
		describe('On https', function () {
			var mockRequest, mockResponse, next;
			beforeEach(function (done) {
				mockRequest = require('../_mock/request');
				mockRequest.secure = true;
				mockResponse = require('../_mock/response');
				next = jasmine.createSpy('next');
				helper(mockRequest, mockResponse, function () {
					done();
					next();
				});
			});
			it('Sets site info from settings into app.locals', function () {
				expect(app.locals.siteName).toBe(app.get('site name'));
				expect(app.locals.baseUrl).toBe(app.get('https url'));
			});
			it('Calls next()', function () {
				expect(next).toHaveBeenCalled();
			});
		});
	});
}(require('lodash'), require('jasmine-node'), require('graceful-fs'), require('path'), require('../../../lib/middleware/prepareView'), require('../_mock/application')));
