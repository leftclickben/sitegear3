/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, sitegearSession) {
	"use strict";

	describe('Helper: sitegearSession', function () {
		var app, helper, mockRequest, mockResponse, container;
		beforeEach(function () {
			app = sitegear3().initialise(require('../settings.json'));
			helper = sitegearSession(app);
			mockRequest = {
				accepts: function () { return false; },
				originalUrl: 'http://localhost:8080/',
				cookies: {
					"sitegear3.session.test-spec": []
				}
			};
			mockResponse = {
				type: function () { return mockResponse; },
				status: function () { return mockResponse; },
				render: function () { return mockResponse; },
				send: function () { return mockResponse; },
				on: function () { return mockResponse; }
			};
			container = {
				next: function () {}
			};
		});
		it('Exports a function', function () {
			expect(_.isFunction(helper)).toBeTruthy();
		});
		describe('Operates correctly', function () {
			beforeEach(function () {
				spyOn(container, 'next');
				spyOn(mockResponse, 'on');
				helper(mockRequest, mockResponse, container.next);
			});
			it('Sets an appropriate session cookie key', function () {
				expect(app.settings.session.key).toBe('sitegear3.session.test-spec')
			});
			it('Delegates to the cookieSession middleware', function () {
				expect(mockResponse.on).toHaveBeenCalled();
				expect(mockResponse.on.callCount).toBe(1);
			});
			it('Calls next()', function () {
				expect(container.next).toHaveBeenCalled();
				expect(container.next.callCount).toBe(1);
			});
		});
		afterEach(function () {
			app.dispose();
		});
	});
}(require('lodash'), require('../../../index'), require('../../../lib/helpers/sitegearSession')));
