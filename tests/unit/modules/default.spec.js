/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, defaultModule) {
	"use strict";
	require('../setupTests');

	describe('Module: default', function () {
		it('Exports a function', function () {
			expect(_.isFunction(defaultModule)).toBeTruthy();
		});
		describe('Operates correctly', function () {
			var app, module;
			beforeEach(function () {
				app = require('../_mock/app');
				module = defaultModule(app);
			});
			it('Exposes all required action methods', function () {
				expect(_.isFunction(module.index)).toBeTruthy();
			});
			describe('The index() action', function () {
				var mockRequest, mockResponse;
				beforeEach(function () {
					mockRequest = require('../_mock/request');
					mockResponse = require('../_mock/response');
					spyOn(app.interfaces.storage, 'get').andCallThrough();
					spyOn(mockResponse, 'render');
					module.index()(mockRequest, mockResponse);
				});
				it('Makes the correct number of calls to persistence', function () {
					expect(app.interfaces.storage.get).toHaveBeenCalled();
					expect(app.interfaces.storage.get.callCount).toBe(1);
				});
				it('Calls response.render()', function () {
					expect(mockResponse.render).toHaveBeenCalled();
					expect(mockResponse.render.callCount).toBe(1);
				});
			});
			afterEach(function () {
				app.stop();
			});
		});
	});
}(require('lodash'), require('../../../index'), require('../../../lib/modules/default')));
