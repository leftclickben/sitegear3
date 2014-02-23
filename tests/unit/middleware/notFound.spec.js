/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, jasmine, notFound) {
	"use strict";
	require('../../setupTests');

	describe('middleware/notFound.js', function () {
		it('exports a function', function () {
			expect(_.isFunction(notFound)).toBeTruthy();
		});
		describe('when invoked', function () {
			var helper, mockRequest, mockResponse, next;
			beforeEach(function () {
				helper = notFound();
				mockRequest = require('../_mock/request');
				mockResponse = require('../_mock/response');
				spyOn(mockResponse, 'status');
				next = jasmine.createSpy('next');
				helper(mockRequest, mockResponse, next);
			});
			it('returns a function', function () {
				expect(_.isFunction(helper)).toBeTruthy();
			});
			it('sets a 404 status', function () {
				expect(mockResponse.status).toHaveBeenCalledWith(404);
				expect(mockResponse.status.callCount).toBe(1);
			});
			it('doesn\'t call next()', function () {
				expect(next).not.toHaveBeenCalled();
			});
		});
		describe('emits the correct response type', function () {
			var helper, mockRequest, mockResponse;
			beforeEach(function () {
				helper = notFound();
				mockRequest = require('../_mock/request');
				mockResponse = require('../_mock/response');
			});
			describe('when HTML is accepted by the request', function () {
				beforeEach(function () {
					spyOn(mockResponse, 'render');
					mockRequest.accepts = function (type) {
						return type === 'html';
					};
					helper(mockRequest, mockResponse);
				});
				it('calls response.render()', function () {
					expect(mockResponse.render).toHaveBeenCalledWith('_errors/404', { status: 'Not Found' });
					expect(mockResponse.render.callCount).toBe(1);
				});
			});
			describe('when JSON is accepted by the request', function () {
				beforeEach(function () {
					spyOn(mockResponse, 'send');
					mockRequest.accepts = function (type) {
						return type === 'json';
					};
					helper(mockRequest, mockResponse);
				});
				it('returns an object with "status" key', function () {
					expect(mockResponse.send).toHaveBeenCalledWith({ status: 'Not Found' });
					expect(mockResponse.send.callCount).toBe(1);
				});
			});
			describe('when neither HTML nor JSON is accepted by the request', function () {
				beforeEach(function () {
					spyOn(mockResponse, 'type').andReturn(mockResponse);
					spyOn(mockResponse, 'send');
					mockRequest.accepts = function (type) {
						return type !== 'html' && type !== 'json';
					};
					helper(mockRequest, mockResponse);
				});
				it('returns the error as plain text', function () {
					expect(mockResponse.type).toHaveBeenCalledWith('txt');
					expect(mockResponse.type.callCount).toBe(1);
					expect(mockResponse.send).toHaveBeenCalledWith('Not Found');
					expect(mockResponse.send.callCount).toBe(1);
				});
			});
		});
	});
}(require('lodash'), require('jasmine-node'), require('../../../lib/middleware/notFound')));
