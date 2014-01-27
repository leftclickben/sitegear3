/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, defaultController) {
	"use strict";
	require('../setupTests');

	describe('Controller: default', function () {
		it('Exports a function', function () {
			expect(_.isFunction(defaultController)).toBeTruthy();
		});
		describe('Operates correctly', function () {
			var app, controller;
			beforeEach(function () {
				app = sitegear3().initialise(require('../settings.json'));
				app.redis = {
					get: function (key, callback) {
						callback(null, 'This is the value for key: ' + key);
					}
				};
				controller = defaultController(app);
			});
			it('Exposes all required action methods', function () {
				expect(_.isFunction(controller.index)).toBeTruthy();
			});
			describe('The index() action', function () {
				var mockRequest, mockResponse;
				beforeEach(function () {
					mockRequest = { path: '/some/url/path' };
					mockResponse = { render: function () { } };
					spyOn(mockResponse, 'render');
					spyOn(app.redis, 'get').andCallThrough();
					controller.index()(mockRequest, mockResponse);
				});
				it('Makes the correct number of calls to persistence', function () {
					expect(app.redis.get).toHaveBeenCalled();
					expect(app.redis.get.callCount).toBe(2);
				});
				it('Calls response.render()', function () {
					expect(mockResponse.render).toHaveBeenCalled();
					expect(mockResponse.render.callCount).toBe(1);
				});
			});
			afterEach(function () {
				app.dispose();
			});
		});
	});
}(require('lodash'), require('../../../index'), require('../../../lib/controllers/default')));
