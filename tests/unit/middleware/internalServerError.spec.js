/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, jasmine, internalServerError) {
	"use strict";
	require('../../setupTests');

	describe('middleware/internalServerError.js', function () {
		it('exports a function', function () {
			expect(_.isFunction(internalServerError)).toBeTruthy();
		});
		describe('when invoked with no parameters', function () {
			var helper, mockRequest, mockResponse;
			beforeEach(function () {
				helper = internalServerError();
				mockRequest = require('../_mock/request');
				mockResponse = require('../_mock/response');
			});
			it('returns a function', function () {
				expect(_.isFunction(helper)).toBeTruthy();
			});
			describe('when passed an error with no status', function () {
				var error, next;
				beforeEach(function () {
					error = new Error('This is an error.');
					spyOn(console, 'log');
					spyOn(mockResponse, 'status');
					next = jasmine.createSpy('next');
					helper(error, mockRequest, mockResponse, next);
				});
				it('logs to the console', function () {
					expect(console.log).toHaveBeenCalled();
					expect(console.log.callCount).toBe(2);
				});
				it('sets a 500 status', function () {
					expect(mockResponse.status).toHaveBeenCalledWith(500);
					expect(mockResponse.status.callCount).toBe(1);
				});
				it('doesn\'t call next()', function () {
					expect(next).not.toHaveBeenCalled();
				});
			});
			describe('when passed an error with a status', function () {
				var error, next;
				beforeEach(function () {
					error = new Error('This is an error.');
					error.status = 501;
					spyOn(console, 'log');
					spyOn(mockResponse, 'status');
					next = jasmine.createSpy('next');
					helper(error, mockRequest, mockResponse, next);
				});
				it('logs to the console', function () {
					expect(console.log).toHaveBeenCalled();
					expect(console.log.callCount).toBe(2);
				});
				it('sets the status from the error object', function () {
					expect(mockResponse.status).toHaveBeenCalledWith(501);
					expect(mockResponse.status.callCount).toBe(1);
				});
				it('doesn\'t call next()', function () {
					expect(next).not.toHaveBeenCalled();
				});
			});
		});
		describe('when invoked with a custom callback', function () {
			var helper, mockRequest, mockResponse, callback;
			beforeEach(function () {
				callback = jasmine.createSpy('callback');
				helper = internalServerError(callback);
				mockRequest = require('../_mock/request');
				mockResponse = require('../_mock/response');
			});
			it('returns a function', function () {
				expect(_.isFunction(helper)).toBeTruthy();
			});
			describe('when passed an error with no status', function () {
				var error, next;
				beforeEach(function () {
					error = new Error('This is an error.');
					spyOn(console, 'log');
					spyOn(mockResponse, 'status');
					next = jasmine.createSpy('next');
					helper(error, mockRequest, mockResponse, next);
				});
				it('calls the callback', function () {
					expect(callback).toHaveBeenCalled();
					expect(callback.callCount).toBe(1);
				});
				it('does not log to the console', function () {
					expect(console.log).not.toHaveBeenCalled();
				});
				it('sets a 500 status', function () {
					expect(mockResponse.status).toHaveBeenCalledWith(500);
					expect(mockResponse.status.callCount).toBe(1);
				});
				it('doesn\'t call next()', function () {
					expect(next).not.toHaveBeenCalled();
				});
			});
			describe('when passed an error with a status', function () {
				var error, next;
				beforeEach(function () {
					error = new Error('This is an error.');
					error.status = 501;
					spyOn(console, 'log');
					spyOn(mockResponse, 'status');
					next = jasmine.createSpy('next');
					helper(error, mockRequest, mockResponse, next);
				});
				it('calls the callback', function () {
					expect(callback).toHaveBeenCalled();
					expect(callback.callCount).toBe(1);
				});
				it('does not log to the console', function () {
					expect(console.log).not.toHaveBeenCalled();
				});
				it('sets the status from the error object', function () {
					expect(mockResponse.status).toHaveBeenCalledWith(501);
					expect(mockResponse.status.callCount).toBe(1);
				});
				it('doesn\'t call next()', function () {
					expect(next).not.toHaveBeenCalled();
				});
			});
		});
		describe('emits the correct response type', function () {
			var helper, mockRequest, mockResponse;
			beforeEach(function () {
				helper = internalServerError();
				mockRequest = require('../_mock/request');
				mockResponse = require('../_mock/response');
			});
			describe('when HTML is accepted by the request', function () {
				var error;
				beforeEach(function () {
					error = new Error('This is an error.');
					spyOn(mockResponse, 'render');
					mockRequest.accepts = function (type) {
						return type === 'html';
					};
					helper(error, mockRequest, mockResponse);
				});
				it('calls response.render()', function () {
					expect(mockResponse.render).toHaveBeenCalledWith('_errors/500', { status: 'Internal Server Error', error: error });
					expect(mockResponse.render.callCount).toBe(1);
				});
			});
			describe('when JSON is accepted by the request', function () {
				var error;
				beforeEach(function () {
					error = new Error('This is an error.');
					spyOn(mockResponse, 'send');
					mockRequest.accepts = function (type) {
						return type === 'json';
					};
					helper(error, mockRequest, mockResponse);
				});
				it('returns an object with "status" and "error" keys', function () {
					expect(mockResponse.send).toHaveBeenCalledWith({ status: 'Internal Server Error', error: error });
					expect(mockResponse.send.callCount).toBe(1);
				});
			});
			describe('when neither HTML nor JSON are accepted', function () {
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
				it('returns the error as plain text', function () {
					expect(mockResponse.type).toHaveBeenCalledWith('txt');
					expect(mockResponse.type.callCount).toBe(1);
					expect(mockResponse.send).toHaveBeenCalledWith('Internal Server Error: ' + error);
					expect(mockResponse.send.callCount).toBe(1);
				});
			});
		});
	});
}(require('lodash'), require('jasmine-node'), require('../../../lib/middleware/internalServerError')));
