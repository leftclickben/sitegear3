/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, jasmine, notFound) {
	"use strict";
	require('../setupTests');

	describe('Helper: notFound', function () {
		var helper;
		beforeEach(function () {
			helper = notFound();
		});
		it('Exports a function', function () {
			expect(_.isFunction(helper)).toBeTruthy();
		});
		describe('Works as expected', function () {
			var mockRequest, mockResponse;
			beforeEach(function () {
				mockRequest = require('../_mock/request');
				mockResponse = require('../_mock/response');
			});
			describe('Sets HTTP status to 404', function () {
				beforeEach(function () {
					spyOn(mockResponse, 'status');
					helper(mockRequest, mockResponse);
				});
				it('Sets a 404 status', function () {
					expect(mockResponse.status).toHaveBeenCalledWith(404);
					expect(mockResponse.status.callCount).toBe(1);
				});
			});
			describe('Calls response.render() when HTML is accepted', function () {
				beforeEach(function () {
					spyOn(mockResponse, 'render');
					mockRequest.accepts = function (type) {
						return type === 'html';
					};
					helper(mockRequest, mockResponse);
				});
				it('Calls response.render()', function () {
					expect(mockResponse.render).toHaveBeenCalledWith('_errors/404', { status: 'Not Found' });
					expect(mockResponse.render.callCount).toBe(1);
				});
			});
			describe('Returns an object when JSON is accepted', function () {
				beforeEach(function () {
					spyOn(mockResponse, 'send');
					mockRequest.accepts = function (type) {
						return type === 'json';
					};
					helper(mockRequest, mockResponse);
				});
				it('Returns an object with "status" key', function () {
					expect(mockResponse.send).toHaveBeenCalledWith({ status: 'Not Found' });
					expect(mockResponse.send.callCount).toBe(1);
				});
			});
			describe('Returns a plain text response when neither HTML nor JSON is accepted', function () {
				beforeEach(function () {
					spyOn(mockResponse, 'type').andReturn(mockResponse);
					spyOn(mockResponse, 'send');
					mockRequest.accepts = function (type) {
						return type !== 'html' && type !== 'json';
					};
					helper(mockRequest, mockResponse);
				});
				it('Returns the error as plain text', function () {
					expect(mockResponse.type).toHaveBeenCalledWith('txt');
					expect(mockResponse.type.callCount).toBe(1);
					expect(mockResponse.send).toHaveBeenCalledWith('Not Found');
					expect(mockResponse.send.callCount).toBe(1);
				});
			});
			describe('Doesn\'t call next()', function () {
				var next;
				beforeEach(function () {
					next = jasmine.createSpy('next');
					helper(mockRequest, mockResponse, next);
				});
				it('Doesn\'t call next()', function () {
					expect(next).not.toHaveBeenCalled();
				});
			});
		});
	});
}(require('lodash'), require('jasmine-node'), require('../../../lib/helpers/notFound')));
