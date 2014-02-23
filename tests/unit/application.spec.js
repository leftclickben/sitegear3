/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, mockMediator, mockServer, mockAdapter, http, https, fs) {
	"use strict";
	require('../setupTests');

	describe('Application', function () {
		describe('initialise()', function () {
			var app;
			describe('With no parameters', function () {
				beforeEach(function () {
					app = sitegear3();
				});
				it('Exposes all defaults as settings', function () {
					expect(app.get('site name')).toBe('Anonymous Website');
					expect(app.get('http url')).toBe('http://localhost/');
					expect(app.get('https url')).toBe('https://localhost/');
				});
				it('Does not expose additional settings', function () {
					expect(app.get('testKey')).toBeUndefined();
					expect(app.get('foo')).toBeUndefined();
				});
			});
			describe('With object parameter', function () {
				var settings = require('./_input/settings.json');
				beforeEach(function () {
					app = sitegear3(settings);
				});
				it('Applies settings over defaults', function () {
					expect(app.get('site name')).toBe('Test Spec');
					expect(app.get('foo')).toBe('bar');
				});
				it('Exposes defaults not overridden as settings', function () {
					expect(app.get('http url')).toBe('http://localhost/');
					expect(app.get('https url')).toBe('https://localhost/');
				});
				it('Utilises settings expansion', function () {
					expect(app.get('expando')).toBe('bar');
					expect(app.get('expando2')).toBe('bar');
					expect(app.get('expando3')).toBe('prefix-bar');
					expect(app.get('expando4')).toBe('bar-suffix');
					expect(app.get('expando5')).toBe('prefix-bar-suffix');
				});
				it('Does not expose additional settings', function () {
					expect(app.get('testKey')).toBeUndefined();
				});
			});
		});
		describe('routing()', function () {
			var app;
			describe('Works correctly with correct configuration', function () {
				beforeEach(function () {
					app = sitegear3(require('./_input/settings.json'));
					app.data = mockMediator();
					app.component = function (name) {
						if (name === 'products') {
							return {
								index: _.noop,
								item: _.noop
							};
						}
						if (name === 'default') {
							return {
								index: _.noop
							};
						}
						return null;
					};
					app.routing([
						{
							path: '/products',
							component: 'products'
						},
						{
							path: '/products/:item',
							component: 'products',
							action: 'item'
						},
						{
							path: '*'
						}
					]);
				});
				it('Adds all expected routes', function () {
					expect(_.size(app.routes.get)).toBe(3);
					expect(_.size(app.routes.post)).toBe(0);
					expect(_.size(app.routes.put)).toBe(0);
					expect(_.size(app.routes.dele)).toBe(0);
				});
				it('Correctly configures static routes to non-default components', function () {
					expect(app.routes.get[0].path).toBe('/products');
					expect(app.routes.get[0].method).toBe('get');
					expect(app.routes.get[0].callbacks.length).toBe(1);
					expect(_.isFunction(app.routes.get[0].callbacks[0])).toBeTruthy();
					expect(app.routes.get[0].keys.length).toBe(0);
					expect(app.routes.get[0].regexp.test('/products')).toBeTruthy();
					expect(app.routes.get[0].regexp.test('/products/')).toBeTruthy();
					expect(app.routes.get[0].regexp.test('/products/widgets')).toBeFalsy();
					expect(app.routes.get[0].regexp.test('/products/widgets/')).toBeFalsy();
					expect(app.routes.get[0].regexp.test('/')).toBeFalsy();
					expect(app.routes.get[0].regexp.test('//')).toBeFalsy();
					expect(app.routes.get[0].regexp.test('/about')).toBeFalsy();
					expect(app.routes.get[0].regexp.test('/about/')).toBeFalsy();
					expect(app.routes.get[0].regexp.test('/about/history')).toBeFalsy();
					expect(app.routes.get[0].regexp.test('/about/history/')).toBeFalsy();
				});
				it('Correctly configures slug routes', function () {
					expect(app.routes.get[1].path).toBe('/products/:item');
					expect(app.routes.get[1].method).toBe('get');
					expect(app.routes.get[1].callbacks.length).toBe(1);
					expect(_.isFunction(app.routes.get[1].callbacks[0])).toBeTruthy();
					expect(app.routes.get[1].keys.length).toBe(1);
					expect(app.routes.get[1].regexp.test('/products')).toBeFalsy();
					expect(app.routes.get[1].regexp.test('/products/')).toBeFalsy();
					expect(app.routes.get[1].regexp.test('/products/widgets')).toBeTruthy();
					expect(app.routes.get[1].regexp.test('/products/widgets/')).toBeTruthy();
					expect(app.routes.get[1].regexp.test('/')).toBeFalsy();
					expect(app.routes.get[1].regexp.test('//')).toBeFalsy();
					expect(app.routes.get[1].regexp.test('/about')).toBeFalsy();
					expect(app.routes.get[1].regexp.test('/about/')).toBeFalsy();
					expect(app.routes.get[1].regexp.test('/about/history')).toBeFalsy();
					expect(app.routes.get[1].regexp.test('/about/history/')).toBeFalsy();
				});
				it('Correctly configures the fallback route', function () {
					expect(app.routes.get[2].path).toBe('*');
					expect(app.routes.get[2].method).toBe('get');
					expect(app.routes.get[2].callbacks.length).toBe(1);
					expect(_.isFunction(app.routes.get[2].callbacks[0])).toBeTruthy();
					expect(app.routes.get[2].keys.length).toBe(0);
					expect(app.routes.get[2].regexp.test('/products')).toBeTruthy();
					expect(app.routes.get[2].regexp.test('/products/')).toBeTruthy();
					expect(app.routes.get[2].regexp.test('/products/widgets')).toBeTruthy();
					expect(app.routes.get[2].regexp.test('/products/widgets/')).toBeTruthy();
					expect(app.routes.get[2].regexp.test('/')).toBeTruthy();
					expect(app.routes.get[2].regexp.test('//')).toBeTruthy();
					expect(app.routes.get[2].regexp.test('/about')).toBeTruthy();
					expect(app.routes.get[2].regexp.test('/about/')).toBeTruthy();
					expect(app.routes.get[2].regexp.test('/about/history')).toBeTruthy();
					expect(app.routes.get[2].regexp.test('/about/history/')).toBeTruthy();
				});
			});
			describe('Handles invalid component', function () {
				beforeEach(function () {
					app = sitegear3(require('./_input/settings.json'));
					app.data = mockMediator();
				});
				it('Throws an error when invalid component is specified', function () {
					try {
						app.routing([
							{
								path: '/some/path',
								component: 'INVALID'
							}
						]);
						expect('This code should not execute').toBeFalsy();
					} catch (error) {
						expect(error.toString()).toMatch(/Error: Cannot find module 'sitegear3-component-INVALID'/);
					}
				});
			});
			describe('Handles unknown action', function () {
				beforeEach(function () {
					app = sitegear3(require('./_input/settings.json'));
					app.data = mockMediator();
					app.component = function (name) {
						if (name === 'default') {
							return {
								index: _.noop
							};
						}
						return null;
					};
				});
				it('Throws an error when invalid action is specified in a valid component', function () {
					try {
						app.routing([
							{
								path: '/another/path',
								action: 'INVALID'
							}
						]);
						expect('This code should not execute').toBeFalsy();
					} catch (error) {
						expect(error.toString()).toBe('Error: Unknown action "INVALID" specified for route at URL "/another/path"');
					}
				});
			});
		});
		describe('connect()', function () {
			var app;
			beforeEach(function () {
				app = sitegear3(require('./_input/settings.json')).connect(mockAdapter());
			});
			it('Instantiates the data mediator', function () {
				expect(app.data).toBeDefined();
			});
		});
		describe('start()', function () {
			var app, originalHttpCreateServer, server;
			beforeEach(function () {
				app = sitegear3(require('./_input/settings.json'));
				server = mockServer();
				spyOn(server, 'listen').andCallThrough();
				originalHttpCreateServer = http.createServer;
				spyOn(http, 'createServer').andReturn(server);
			});
			describe('With default port', function () {
				beforeEach(function (done) {
					app.start(done);
				});
				it('Calls createServer() on http', function () {
					expect(http.createServer).toHaveBeenCalledWith(app);
					expect(http.createServer.callCount).toBe(1);
				});
				it('Listens on the default port', function () {
					expect(server.listen).toHaveBeenCalled();
					expect(server.listen.callCount).toBe(1);
					expect(server.listen.mostRecentCall.args.length).toBe(2);
					expect(server.listen.mostRecentCall.args[0]).toBe(80);
					expect(_.isFunction(server.listen.mostRecentCall.args[1])).toBeTruthy();
				});
				it('Exposes the server by app.server.http', function () {
					expect(app.server.http).toBe(server);
				});
				afterEach(function (done) {
					app.stop(done);
				});
			});
			describe('With specified port', function () {
				beforeEach(function (done) {
					app.start(8080, done);
				});
				it('Calls createServer() on http', function () {
					expect(http.createServer).toHaveBeenCalledWith(app);
					expect(http.createServer.callCount).toBe(1);
				});
				it('Listens on the specified port', function () {
					expect(server.listen).toHaveBeenCalled();
					expect(server.listen.callCount).toBe(1);
					expect(server.listen.mostRecentCall.args.length).toBe(2);
					expect(server.listen.mostRecentCall.args[0]).toBe(8080);
					expect(_.isFunction(server.listen.mostRecentCall.args[1])).toBeTruthy();
				});
				it('Exposes the server by app.server.http', function () {
					expect(app.server.http).toBe(server);
				});
				afterEach(function (done) {
					app.stop(done);
				});
			});
			afterEach(function () {
				http.createServer = originalHttpCreateServer;
			});
		});
		describe('startSecure()', function () {
			var app, originalHttpsCreateServer, server;
			beforeEach(function () {
				app = sitegear3(require('./_input/settings.json'));
				server = mockServer();
				spyOn(server, 'listen').andCallThrough();
				originalHttpsCreateServer = https.createServer;
				spyOn(https, 'createServer').andReturn(server);
			});
			describe('With inline options object and default port', function () {
				beforeEach(function (done) {
					app.startSecure({ pfx: 'some encrypted data' }, done);
				});
				it('Calls createServer() on https', function () {
					expect(https.createServer).toHaveBeenCalledWith({ pfx: 'some encrypted data' }, app);
					expect(https.createServer.callCount).toBe(1);
				});
				it('Listens on the default port', function () {
					expect(server.listen).toHaveBeenCalled();
					expect(server.listen.callCount).toBe(1);
					expect(server.listen.mostRecentCall.args.length).toBe(2);
					expect(server.listen.mostRecentCall.args[0]).toBe(443);
					expect(_.isFunction(server.listen.mostRecentCall.args[1])).toBeTruthy();
				});
				it('Exposes the server by app.server.https', function () {
					expect(app.server.https).toBe(server);
				});
				afterEach(function (done) {
					app.stop(done);
				});
			});
			describe('With inline options object and specified port', function () {
				beforeEach(function (done) {
					app.startSecure({ pfx: 'some encrypted data' }, 8444, done);
				});
				it('Calls createServer() on https', function () {
					expect(https.createServer).toHaveBeenCalledWith({ pfx: 'some encrypted data' }, app);
					expect(https.createServer.callCount).toBe(1);
				});
				it('Listens on the specified port', function () {
					expect(server.listen).toHaveBeenCalled();
					expect(server.listen.callCount).toBe(1);
					expect(server.listen.mostRecentCall.args.length).toBe(2);
					expect(server.listen.mostRecentCall.args[0]).toBe(8444);
					expect(_.isFunction(server.listen.mostRecentCall.args[1])).toBeTruthy();
				});
				it('Exposes the server by app.server.https', function () {
					expect(app.server.https).toBe(server);
				});
				afterEach(function (done) {
					app.stop(done);
				});
			});
			describe('With specified PFX filename and default port', function () {
				var originalReadFile;
				beforeEach(function (done) {
					originalReadFile = fs.readFile;
					spyOn(fs, 'readFile').andCallFake(function (filename, callback) {
						callback(null, 'some encrypted data from file');
					});
					app.startSecure('/path/to/localhost.pfx', done);
				});
				it('Reads the PFX from file', function () {
					expect(fs.readFile).toHaveBeenCalled();
					expect(fs.readFile.callCount).toBe(1);
				});
				it('Calls createServer() on https', function () {
					expect(https.createServer).toHaveBeenCalledWith({ pfx: 'some encrypted data from file' }, app);
					expect(https.createServer.callCount).toBe(1);
				});
				it('Listens on the specified port', function () {
					expect(server.listen).toHaveBeenCalled();
					expect(server.listen.callCount).toBe(1);
					expect(server.listen.mostRecentCall.args.length).toBe(2);
					expect(server.listen.mostRecentCall.args[0]).toBe(443);
					expect(_.isFunction(server.listen.mostRecentCall.args[1])).toBeTruthy();
				});
				it('Exposes the server by app.server.https', function () {
					expect(app.server.https).toBe(server);
				});
				afterEach(function (done) {
					app.stop(done);
					fs.readFile = originalReadFile;
				});
			});
			describe('With specified PFX filename and specified port', function () {
				var originalReadFile;
				beforeEach(function (done) {
					originalReadFile = fs.readFile;
					spyOn(fs, 'readFile').andCallFake(function (filename, callback) {
						callback(null, 'some encrypted data from file');
					});
					app.startSecure('/path/to/localhost.pfx', 8444, done);
				});
				it('Reads the PFX from file', function () {
					expect(fs.readFile).toHaveBeenCalled();
					expect(fs.readFile.callCount).toBe(1);
				});
				it('Calls createServer() on https', function () {
					expect(https.createServer).toHaveBeenCalledWith({ pfx: 'some encrypted data from file' }, app);
					expect(https.createServer.callCount).toBe(1);
				});
				it('Listens on the specified port', function () {
					expect(server.listen).toHaveBeenCalled();
					expect(server.listen.callCount).toBe(1);
					expect(server.listen.mostRecentCall.args.length).toBe(2);
					expect(server.listen.mostRecentCall.args[0]).toBe(8444);
					expect(_.isFunction(server.listen.mostRecentCall.args[1])).toBeTruthy();
				});
				it('Exposes the server by app.server.https', function () {
					expect(app.server.https).toBe(server);
				});
				afterEach(function (done) {
					app.stop(done);
					fs.readFile = originalReadFile;
				});
			});
			afterEach(function () {
				https.createServer = originalHttpsCreateServer;
			});
		});
		describe('stop()', function () {
			var app, originalHttpCreateServer, originalHttpsCreateServer;
			beforeEach(function () {
				originalHttpCreateServer = http.createServer;
				originalHttpsCreateServer = https.createServer;
				http.createServer = mockServer;
				https.createServer = mockServer;
			});
			describe('When start() was called', function () {
				var httpServer;
				beforeEach(function (done) {
					app = sitegear3(require('./_input/settings.json')).start(function () {
						httpServer = app.server.http;
						spyOn(httpServer, 'close').andCallThrough();
						app.stop(done);
					});
				});
				it('Calls close() on http server', function () {
					expect(httpServer.close).toHaveBeenCalled();
					expect(httpServer.close.callCount).toBe(1);
				});
				it('Removes app.server', function () {
					expect(app.server).toBeUndefined();
				});
			});
			describe('When startSecure() was called', function () {
				var httpsServer;
				beforeEach(function (done) {
					app = sitegear3(require('./_input/settings.json')).startSecure({ pfx: 'some encrypted data' }, function () {
						httpsServer = app.server.https;
						spyOn(httpsServer, 'close').andCallThrough();
						app.stop(done);
					});
				});
				it('Calls close() on https server', function () {
					expect(httpsServer.close).toHaveBeenCalled();
					expect(httpsServer.close.callCount).toBe(1);
				});
				it('Removes app.server', function () {
					expect(app.server).toBeUndefined();
				});
			});
			describe('When both start() and startSecure() were called', function () {
				var httpServer, httpsServer;
				beforeEach(function (done) {
					app = sitegear3(require('./_input/settings.json')).start(function () {
						app.startSecure({ pfx: 'some encrypted data' }, function () {
							httpsServer = app.server.https;
							spyOn(httpsServer, 'close').andCallThrough();
							httpServer = app.server.http;
							spyOn(httpServer, 'close').andCallThrough();
							app.stop(done);
						});
					});
				});
				it('Calls close() on http server', function () {
					expect(httpServer.close).toHaveBeenCalled();
					expect(httpServer.close.callCount).toBe(1);
				});
				it('Calls close() on https server', function () {
					expect(httpsServer.close).toHaveBeenCalled();
					expect(httpsServer.close.callCount).toBe(1);
				});
				it('Removes app.server', function () {
					expect(app.server).toBeUndefined();
				});
			});
			afterEach(function () {
				http.createServer = originalHttpCreateServer;
				https.createServer = originalHttpsCreateServer;
			});
		});
	});
}(require('lodash'), require('../../'), require('./_mock/mediator'), require('./_mock/server'), require('./_mock/adapter'), require('http'), require('https'), require('fs')));
