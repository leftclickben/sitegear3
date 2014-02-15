/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (sitegear3, http, https, mockServer) {
	"use strict";
	require('../setupTests');

	describe('Application lifecycle: start()', function () {
		var app;
		beforeEach(function () {
			app = sitegear3().initialise(require('../settings.json'));
			spyOn(http, 'createServer').andReturn(mockServer());
			spyOn(https, 'createServer').andReturn(mockServer());
		});
		describe('With no parameters', function () {
			beforeEach(function () {
				app.start();
			});
			it('Calls createServer() on http', function () {
				expect(http.createServer).toHaveBeenCalledWith(app);
				expect(http.createServer.callCount).toBe(1);
			});
			it('Does not call createServer() on https', function () {
				expect(https.createServer).not.toHaveBeenCalled();
			});
			afterEach(function () {
				app.stop();
			});
		});
		describe('With one parameter', function () {
			beforeEach(function () {
				app.start(8080);
			});
			it('Calls createServer() on http', function () {
				expect(http.createServer).toHaveBeenCalledWith(app);
				expect(http.createServer.callCount).toBe(1);
			});
			it('Does not call createServer() on https', function () {
				expect(https.createServer).not.toHaveBeenCalled();
			});
			afterEach(function () {
				app.stop();
			});
		});
		describe('With two parameters', function () {
			beforeEach(function () {
				app.start(8080, {});
			});
			it('Calls createServer() on http', function () {
				expect(http.createServer).toHaveBeenCalledWith(app);
				expect(http.createServer.callCount).toBe(1);
			});
			it('Calls createServer() on https', function () {
				expect(https.createServer).toHaveBeenCalledWith({}, app);
				expect(https.createServer.callCount).toBe(1);
			});
			afterEach(function () {
				app.stop();
			});
		});
		describe('With two parameters skipping httpPort', function () {
			beforeEach(function () {
				app.start({}, 8443);
			});
			it('Does not call createServer() on http', function () {
				expect(http.createServer).not.toHaveBeenCalled();
			});
			it('Calls createServer() on https', function () {
				expect(https.createServer).toHaveBeenCalledWith({}, app);
				expect(https.createServer.callCount).toBe(1);
			});
			afterEach(function () {
				app.stop();
			});
		});
		describe('With three parameters', function () {
			beforeEach(function () {
				app.start(8080, {}, 8443);
			});
			it('Calls createServer() on http', function () {
				expect(http.createServer).toHaveBeenCalledWith(app);
				expect(http.createServer.callCount).toBe(1);
			});
			it('Calls createServer() on https', function () {
				expect(https.createServer).toHaveBeenCalledWith({}, app);
				expect(https.createServer.callCount).toBe(1);
			});
			afterEach(function () {
				app.stop();
			});
		});
	});
}(require('../../../index'), require('http'), require('https'), require('../_mock/server')));
