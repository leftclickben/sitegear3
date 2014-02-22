/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, utils, mockMediator, mockServer, mockAdapter, http, https) {
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
				afterEach(function () {
					app.stop();
				});
			});
			describe('With object parameter', function () {
				var originalExpandSettings,
					settings = require('./_input/settings.json');
				beforeEach(function () {
					originalExpandSettings = utils.expandSettings;
					spyOn(utils, 'expandSettings').andCallThrough();
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
					expect(utils.expandSettings).toHaveBeenCalled();
					expect(utils.expandSettings.callCount).toBe(1);
					expect(app.get('expando')).toBe('bar');
					expect(app.get('expando2')).toBe('bar');
					expect(app.get('expando3')).toBe('prefix-bar');
					expect(app.get('expando4')).toBe('bar-suffix');
					expect(app.get('expando5')).toBe('prefix-bar-suffix');
					expect(app.get('expando6')).toBeNull();
				});
				it('Does not expose additional settings', function () {
					expect(app.get('testKey')).toBeUndefined();
				});
				afterEach(function () {
					app.stop();
					utils.expandSettings = originalExpandSettings;
				});
			});
		});
		describe('configureRoutes()', function () {
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
					app.configureRoutes([
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
				afterEach(function () {
					app.stop();
				});
			});
			describe('Handles invalid component', function () {
				beforeEach(function () {
					app = sitegear3(require('./_input/settings.json'));
					app.data = mockMediator();
				});
				it('Throws an error when invalid component is specified', function () {
					try {
						app.configureRoutes([
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
				afterEach(function () {
					app.stop();
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
						app.configureRoutes([
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
				afterEach(function () {
					app.stop();
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
			var app, originalHttpCreateServer, originalHttpsCreateServer;
			beforeEach(function () {
				app = sitegear3(require('./_input/settings.json'));
				originalHttpCreateServer = http.createServer;
				originalHttpsCreateServer = https.createServer;
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
			afterEach(function () {
				http.createServer = originalHttpCreateServer;
				https.createServer = originalHttpsCreateServer;
			});
		});
		describe('stop()', function () {
			var app, originalHttpCreateServer, originalHttpsCreateServer;
			beforeEach(function () {
				originalHttpCreateServer = http.createServer;
				originalHttpsCreateServer = https.createServer;
				spyOn(http, 'createServer').andReturn(mockServer());
				spyOn(https, 'createServer').andReturn(mockServer());
			});
			describe('When start() is called with no parameters', function () {
				beforeEach(function () {
					app = sitegear3(require('./_input/settings.json')).start();
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
					app = sitegear3(require('./_input/settings.json')).start(8888);
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
					app = sitegear3(require('./_input/settings.json')).start(8888, {});
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
					app = sitegear3(require('./_input/settings.json')).start({}, 8444);
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
					app = sitegear3(require('./_input/settings.json')).start(8888, {}, 8444);
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
			afterEach(function () {
				http.createServer = originalHttpCreateServer;
				https.createServer = originalHttpsCreateServer;
			});
		});
	});
}(require('lodash'), require('../../'), require('../../lib/utils'), require('./_mock/mediator'), require('./_mock/server'), require('./_mock/adapter'), require('http'), require('https')));
