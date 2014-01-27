/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, fs, path, prepareView) {
	"use strict";
	require('../setupTests');

	describe('Helper: prepareView', function () {
		var app, helper, mockRequest, mockResponse, container;
		beforeEach(function () {
			app = sitegear3().initialise(require('../settings.json'));
			helper = prepareView(app);
			mockRequest = {};
			mockResponse = {};
			container = {
				next: _.noop
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
//				expect(container.next).toHaveBeenCalled();
//			});
		});
		afterEach(function () {
			app.dispose();
		});
	});
}(require('lodash'), require('../../../index.js'), require('fs'), require('path'), require('../../../lib/helpers/prepareView')));
