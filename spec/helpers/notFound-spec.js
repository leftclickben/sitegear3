/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, notFound) {
	"use strict";

	describe('Helper: notFound', function () {
		var helper = notFound(),
			mockRequest = {
				accepts: function () { return false; }
			},
			mockResponse = {
				type: function () { return mockResponse; },
				status: function () { return mockResponse; },
				render: function () { return mockResponse; },
				send: function () { return mockResponse; }
			},
			container = {
				next: function () {}
			};
		it('Exports a function', function () {
			expect(_.isFunction(helper)).toBeTruthy();
		});
		describe('Sets HTTP status to 404', function () {
			beforeEach(function () {
				spyOn(mockResponse, 'status');
				helper(mockRequest, mockResponse);
			});
			it('Sets a 404 status', function () {
				expect(mockResponse.status).toHaveBeenCalledWith(404);
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
				expect(mockResponse.send).toHaveBeenCalledWith('Not Found');
			});
		});
		describe('Doesn\'t call next()', function () {
			beforeEach(function () {
				spyOn(container, 'next');
				helper(mockRequest, mockResponse, container.next);
			});
			it('Doesn\'t call next()', function () {
				expect(container.next).not.toHaveBeenCalled();
			});
		});
	});
}(require('lodash'), require('../../lib/helpers/notFound')));
