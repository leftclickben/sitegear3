/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, internalServerError) {
	"use strict";

	describe('Helper: internalServerError', function () {
		var helper, mockRequest, mockResponse, container, error, error501;
		beforeEach(function () {
			helper = internalServerError();
			mockRequest = {
				accepts: function () { return false; }
			};
			mockResponse = {
				type: function () { return mockResponse; },
				status: function () { return mockResponse; },
				render: function () { return mockResponse; },
				send: function () { return mockResponse; }
			};
			container = {
				next: function () {}
			};
			error = new Error('This is an error.');
			error501 = new Error('This is an error.');
			error501.status = 501;
		});
		it('Exports a function', function () {
			expect(_.isFunction(helper)).toBeTruthy();
		});
		describe('Uses the logger', function () {
			beforeEach(function () {
				spyOn(console, 'log');
				helper(error, mockRequest, mockResponse);
			});
			it('Logs to the console', function () {
				expect(console.log).toHaveBeenCalled();
			});
		});
		describe('Sets HTTP status to 500 by default', function () {
			beforeEach(function () {
				spyOn(mockResponse, 'status');
				helper(error, mockRequest, mockResponse);
			});
			it('Sets a 500 status', function () {
				expect(mockResponse.status).toHaveBeenCalledWith(500);
			});
		});
		describe('Sets HTTP status to status given by Error object', function () {
			beforeEach(function () {
				spyOn(mockResponse, 'status');
				helper(error501, mockRequest, mockResponse);
			});
			it('Sets the status from the Error object', function () {
				expect(mockResponse.status).toHaveBeenCalledWith(501);
			});
		});
		describe('Calls response.render() when HTML is accepted', function () {
			beforeEach(function () {
				spyOn(mockResponse, 'render');
				mockRequest.accepts = function (type) {
					return type === 'html';
				};
				helper(error, mockRequest, mockResponse);
			});
			it('Calls response.render()', function () {
				expect(mockResponse.render).toHaveBeenCalledWith('_errors/500', { status: 'Internal Server Error', error: error });
			});
		});
		describe('Returns an object when JSON is accepted', function () {
			beforeEach(function () {
				spyOn(mockResponse, 'send');
				mockRequest.accepts = function (type) {
					return type === 'json';
				};
				helper(error, mockRequest, mockResponse);
			});
			it('Returns an object with "status" and "error" keys', function () {
				expect(mockResponse.send).toHaveBeenCalledWith({ status: 'Internal Server Error', error: error });
			});
		});
		describe('Returns a plain text response when neither HTML nor JSON is accepted', function () {
			beforeEach(function () {
				spyOn(mockResponse, 'type').andReturn(mockResponse);
				spyOn(mockResponse, 'send');
				mockRequest.accepts = function (type) {
					return type !== 'html' && type !== 'json';
				};
				helper(error, mockRequest, mockResponse);
			});
			it('Returns the error as plain text', function () {
				expect(mockResponse.type).toHaveBeenCalledWith('txt');
				expect(mockResponse.send).toHaveBeenCalledWith('Internal Server Error: ' + error);
			});
		});
		describe('Doesn\'t call next()', function () {
			beforeEach(function () {
				spyOn(container, 'next');
				helper(error, mockRequest, mockResponse, container.next);
			});
			it('Doesn\'t call next()', function () {
				expect(container.next).not.toHaveBeenCalled();
			});
		});
	});
}(require('lodash'), require('../../../lib/helpers/internalServerError')));
