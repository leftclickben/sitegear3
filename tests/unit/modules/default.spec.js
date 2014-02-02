/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, defaultModule, jasmine) {
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
				var collection, mockRequest, mockResponse;
				describe('By default', function () {
					beforeEach(function () {
						collection = app.storage.collection('page');
						mockRequest = require('../_mock/request');
						mockResponse = require('../_mock/response');
						spyOn(collection, 'get').andCallThrough();
						module.index()(mockRequest, mockResponse);
					});
					it('Makes the correct number of calls to persistence', function () {
						expect(collection.get).toHaveBeenCalled();
						expect(collection.get.callCount).toBe(1);
					});
				});
				describe('When persistence is returning data normally', function () {
					beforeEach(function () {
						mockRequest = require('../_mock/request');
						mockResponse = require('../_mock/response');
						spyOn(mockResponse, 'render');
						module.index()(mockRequest, mockResponse);
					});
					it('Calls response.render()', function () {
						expect(mockResponse.render).toHaveBeenCalled();
						expect(mockResponse.render.callCount).toBe(1);
					});
				});
				describe('When persistence is throwing errors', function () {
					var next,
						error = new Error('This is an error from storage interface');
					beforeEach(function () {
						mockRequest = require('../_mock/request');
						mockResponse = require('../_mock/response');
						spyOn(mockResponse, 'render');
						next = jasmine.createSpy('next');
						app.storage.collection('page').get = function (key, callback) {
							callback(error);
						};
						module.index()(mockRequest, mockResponse, next);
					});
					it('Calls next() with the error', function () {
						expect(next).toHaveBeenCalledWith(error);
						expect(next.callCount).toBe(1);
					});
					it('Doesn\'t call response.render()', function () {
						expect(mockResponse.render).not.toHaveBeenCalled();
					});
				});
			});
		});
	});
}(require('lodash'), require('../../../index'), require('../../../lib/modules/default/module'), require('jasmine-node')));
