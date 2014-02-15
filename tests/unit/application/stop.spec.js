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

	describe('Application lifecycle: stop()', function () {
		var app;
		beforeEach(function () {
			spyOn(http, 'createServer').andReturn(mockServer());
			spyOn(https, 'createServer').andReturn(mockServer());
		});
		describe('When start() is called with no parameters', function () {
			beforeEach(function () {
				app = sitegear3().initialise(require('../settings.json')).start();
				spyOn(app.server.http, 'close').andCallThrough();
				app.stop();
			});
			it('Calls close() on http server', function () {
				expect(app.server.http.close).toHaveBeenCalled();
				expect(app.server.http.close.callCount).toBe(1);
			});
		});
		describe('When start() is called with one parameter', function () {
			beforeEach(function () {
				app = sitegear3().initialise(require('../settings.json')).start(8888);
				spyOn(app.server.http, 'close').andCallThrough();
				app.stop();
			});
			it('Calls close() on http server', function () {
				expect(app.server.http.close).toHaveBeenCalled();
				expect(app.server.http.close.callCount).toBe(1);
			});
		});
		describe('When start() is called with two parameters', function () {
			beforeEach(function () {
				app = sitegear3().initialise(require('../settings.json')).start(8888, {});
				spyOn(app.server.http, 'close').andCallThrough();
				spyOn(app.server.https, 'close').andCallThrough();
				app.stop();
			});
			it('Calls close() on http and https servers', function () {
				expect(app.server.http.close).toHaveBeenCalled();
				expect(app.server.http.close.callCount).toBe(1);
				expect(app.server.https.close).toHaveBeenCalled();
				expect(app.server.https.close.callCount).toBe(1);
			});
		});
		describe('When start() is called with two parameters and skipping httpPort', function () {
			beforeEach(function () {
				app = sitegear3().initialise(require('../settings.json')).start({}, 8444);
				spyOn(app.server.https, 'close').andCallThrough();
				app.stop();
			});
			it('Calls close() on https server', function () {
				expect(app.server.https.close).toHaveBeenCalled();
				expect(app.server.https.close.callCount).toBe(1);
			});
		});
		describe('When start() is called with three parameters', function () {
			beforeEach(function () {
				app = sitegear3().initialise(require('../settings.json')).start(8888, {}, 8444);
				spyOn(app.server.http, 'close').andCallThrough();
				spyOn(app.server.https, 'close').andCallThrough();
				app.stop();
			});
			it('Calls close() on http and https servers', function () {
				expect(app.server.http.close).toHaveBeenCalled();
				expect(app.server.http.close.callCount).toBe(1);
				expect(app.server.https.close).toHaveBeenCalled();
				expect(app.server.https.close.callCount).toBe(1);
			});
		});
	});
}(require('../../../index'), require('http'), require('https'), require('../_mock/server')));
