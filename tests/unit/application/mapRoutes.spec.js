/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, mockStorageInterface) {
	"use strict";
	require('../setupTests');

	sitegear3.ready(function () {
		describe('Application lifecycle: mapRoutes()', function () {
			var app;
			describe('Works correctly with correct configuration', function () {
				beforeEach(function () {
					app = sitegear3().initialise(require('../settings.json'));
					app.storage = mockStorageInterface();
					app.mapRoutes([
						{
							path: '/products',
							module: 'products'
						},
						{
							path: '/products/:item',
							module: 'products',
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
				it('Correctly configures static routes to non-default modules', function () {
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
			describe('Throws correct errors on misconfiguration', function () {
				beforeEach(function () {
					app = sitegear3().initialise(require('../settings.json'));
					app.storage = mockStorageInterface();
				});
				it('Throws an error when invalid module is specified', function () {
					try {
						app.mapRoutes([
							{
								path: '/some/path',
								module: 'INVALID'
							}
						]);
						expect('This code should not execute').toBeFalsy();
					} catch (error) {
						expect(error.toString()).toBe('Error: Unknown module "INVALID" specified for route at URL "/some/path"');
					}
				});
				it('Throws an error when invalid action is specified in a valid module', function () {
					try {
						app.mapRoutes([
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
	});
}(require('lodash'), require('../../../index'), require('../_mock/storage')));
