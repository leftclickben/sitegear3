/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, jasmine, internalServerError) {
	"use strict";
	require('../setupTests');

	describe('Helper: internalServerError', function () {
		var helper;
		beforeEach(function () {
			helper = internalServerError();
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
			describe('Uses the logger', function () {
				var error;
				beforeEach(function () {
					error = new Error('This is an error.');
					spyOn(console, 'log');
					helper(error, mockRequest, mockResponse);
				});
				it('Logs to the console', function () {
					expect(console.log).toHaveBeenCalled();
				});
			});
			describe('Sets HTTP status to 500 by default', function () {
				var error;
				beforeEach(function () {
					error = new Error('This is an error.');
					spyOn(mockResponse, 'status');
					helper(error, mockRequest, mockResponse);
				});
				it('Sets a 500 status', function () {
					expect(mockResponse.status).toHaveBeenCalledWith(500);
					expect(mockResponse.status.callCount).toBe(1);
				});
			});
			describe('Sets HTTP status to status given by Error object', function () {
				var error;
				beforeEach(function () {
					error = new Error('This is an error.');
					error.status = 501;
					spyOn(mockResponse, 'status');
					helper(error, mockRequest, mockResponse);
				});
				it('Sets the status from the Error object', function () {
					expect(mockResponse.status).toHaveBeenCalledWith(501);
					expect(mockResponse.status.callCount).toBe(1);
				});
			});
			describe('Calls response.render() when HTML is accepted', function () {
				var error;
				beforeEach(function () {
					error = new Error('This is an error.');
					spyOn(mockResponse, 'render');
					mockRequest.accepts = function (type) {
						return type === 'html';
					};
					helper(error, mockRequest, mockResponse);
				});
				it('Calls response.render()', function () {
					expect(mockResponse.render).toHaveBeenCalledWith('_errors/500', { status: 'Internal Server Error', error: error });
					expect(mockResponse.render.callCount).toBe(1);
				});
			});
			describe('Returns an object when JSON is accepted', function () {
				var error;
				beforeEach(function () {
					error = new Error('This is an error.');
					spyOn(mockResponse, 'send');
					mockRequest.accepts = function (type) {
						return type === 'json';
					};
					helper(error, mockRequest, mockResponse);
				});
				it('Returns an object with "status" and "error" keys', function () {
					expect(mockResponse.send).toHaveBeenCalledWith({ status: 'Internal Server Error', error: error });
					expect(mockResponse.send.callCount).toBe(1);
				});
			});
			describe('Returns a plain text response when neither HTML nor JSON is accepted', function () {
				var error;
				beforeEach(function () {
					error = new Error('This is an error.');
					spyOn(mockResponse, 'type').andReturn(mockResponse);
					spyOn(mockResponse, 'send');
					mockRequest.accepts = function (type) {
						return type !== 'html' && type !== 'json';
					};
					helper(error, mockRequest, mockResponse);
				});
				it('Returns the error as plain text', function () {
					expect(mockResponse.type).toHaveBeenCalledWith('txt');
					expect(mockResponse.type.callCount).toBe(1);
					expect(mockResponse.send).toHaveBeenCalledWith('Internal Server Error: ' + error);
					expect(mockResponse.send.callCount).toBe(1);
				});
			});
			describe('Doesn\'t call next()', function () {
				var error, next;
				beforeEach(function () {
					error = new Error('This is an error.');
					next = jasmine.createSpy('next');
					helper(error, mockRequest, mockResponse, next);
				});
				it('Doesn\'t call next()', function () {
					expect(next).not.toHaveBeenCalled();
				});
			});
		});
	});
}(require('lodash'), require('jasmine-node'), require('../../../lib/middleware/internalServerError')));
