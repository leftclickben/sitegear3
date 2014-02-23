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

	describe('middleware/prepareView.js', function () {
		it('exports a function', function () {
			expect(_.isFunction(prepareView)).toBeTruthy();
		});
		describe('when invoked on non-secure protocol', function () {
			var app, helper, mockRequest, mockResponse, next;
			beforeEach(function (done) {
				app = mockApplication();
				helper = prepareView(app);
				mockRequest = require('../_mock/request');
				mockResponse = require('../_mock/response');
				next = jasmine.createSpy('next');
				helper(mockRequest, mockResponse, function () {
					next();
					done();
				});
			});
			it('returns a function', function () {
				expect(_.isFunction(helper)).toBeTruthy();
			});
			it('sets site name from settings into app.locals', function () {
				expect(app.locals.siteName).toBe(app.get('site name'));
			});
			it('sets HTTP URL from settings into app.locals', function () {
				expect(app.locals.baseUrl).toBe(app.get('http url'));
			});
			it('sets the current date into app.locals', function () {
				expect(Object.getPrototypeOf(app.locals.now)).toBe(Date.prototype);
			});
			it('loads view helpers', function () {
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
			it('calls next()', function () {
				expect(next).toHaveBeenCalled();
			});
		});
		describe('when invoked on secure protocol', function () {
			var app, helper, mockRequest, mockResponse, next;
			beforeEach(function (done) {
				app = mockApplication();
				helper = prepareView(app);
				mockRequest = require('../_mock/request');
				mockRequest.secure = true;
				mockResponse = require('../_mock/response');
				next = jasmine.createSpy('next');
				helper(mockRequest, mockResponse, function () {
					done();
					next();
				});
			});
			it('returns a function', function () {
				expect(_.isFunction(helper)).toBeTruthy();
			});
			it('sets site name from settings into app.locals', function () {
				expect(app.locals.siteName).toBe(app.get('site name'));
			});
			it('sets HTTPS URL from settings into app.locals', function () {
				expect(app.locals.baseUrl).toBe(app.get('https url'));
			});
			it('sets the current date into app.locals', function () {
				expect(Object.getPrototypeOf(app.locals.now)).toBe(Date.prototype);
			});
			it('loads view helpers', function () {
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
			it('calls next()', function () {
				expect(next).toHaveBeenCalled();
			});
		});
	});
}(require('lodash'), require('jasmine-node'), require('graceful-fs'), require('path'), require('../../../lib/middleware/prepareView'), require('../_mock/application')));
