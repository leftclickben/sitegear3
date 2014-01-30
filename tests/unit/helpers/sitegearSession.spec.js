/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, jasmine, sitegear3, sitegearSession) {
	"use strict";
	require('../setupTests');

	describe('Helper: sitegearSession', function () {
		var app, helper;
		beforeEach(function () {
			app = require('../_mock/app');
			helper = sitegearSession(app);
		});
		it('Exports a function', function () {
			expect(_.isFunction(helper)).toBeTruthy();
		});
		describe('Operates correctly', function () {
			var mockRequest, mockResponse, next;
			beforeEach(function () {
				mockRequest = require('../_mock/request');
				mockResponse = require('../_mock/response');
				next = jasmine.createSpy('next');
				spyOn(mockResponse, 'on');
				helper(mockRequest, mockResponse, next);
			});
			it('Sets an appropriate session cookie key', function () {
				expect(app.settings.session.key).toBe('sitegear3.session.test-spec');
			});
			it('Delegates to the cookieSession middleware', function () {
				expect(mockResponse.on).toHaveBeenCalled();
				expect(mockResponse.on.callCount).toBe(1);
			});
			it('Calls next()', function () {
				expect(next).toHaveBeenCalled();
				expect(next.callCount).toBe(1);
			});
		});
	});
}(require('lodash'), require('jasmine-node'), require('../../../index'), require('../../../lib/helpers/sitegearSession')));
