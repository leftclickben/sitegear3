/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3) {
	"use strict";
	require('../setupTests');

	describe('Sitegear3 application lifecycle: mapRoutes()', function () {
		var app;
		beforeEach(function () {
			app = sitegear3();
			app.initialise(require('../settings.json'));
			app.mapRoutes({
				'/': {},
				'/about': {},
				'/about/history': {},
				'/about/history/early-days': {},
				'/products': {
					controller: 'products'
				},
				'/products/:product': {
					controller: 'products',
					action: 'details'
				}
			});
		});
		it('Adds all expected routes', function () {
			expect(_.size(app.routes.get)).toBe(6);
			expect(_.size(app.routes.post)).toBe(0);
			expect(_.size(app.routes.put)).toBe(0);
			expect(_.size(app.routes.dele)).toBe(0);
		});
		it('Correctly configures the home page route', function () {
			expect(app.routes.get[0].path).toBe('/');
			expect(app.routes.get[0].callbacks.length).toBe(1);
			expect(_.isFunction(app.routes.get[0].callbacks[0])).toBeTruthy();
			expect(app.routes.get[0].regexp.test('/')).toBeTruthy();
			expect(app.routes.get[0].regexp.test('//')).toBeTruthy();
			expect(app.routes.get[0].regexp.test('/about')).toBeFalsy();
			expect(app.routes.get[0].regexp.test('/about/')).toBeFalsy();
			expect(app.routes.get[0].regexp.test('/about/history')).toBeFalsy();
			expect(app.routes.get[0].regexp.test('/about/history/')).toBeFalsy();
			expect(app.routes.get[0].regexp.test('/about/history/early-days')).toBeFalsy();
			expect(app.routes.get[0].regexp.test('/about/history/early-days/')).toBeFalsy();
			expect(app.routes.get[0].regexp.test('/products')).toBeFalsy();
			expect(app.routes.get[0].regexp.test('/products/')).toBeFalsy();
			expect(app.routes.get[0].regexp.test('/products/widget-abc')).toBeFalsy();
			expect(app.routes.get[0].regexp.test('/products/widget-abc/')).toBeFalsy();
			expect(app.routes.get[0].regexp.test('/products/widget-xyz')).toBeFalsy();
			expect(app.routes.get[0].regexp.test('/products/widget-xyz/')).toBeFalsy();
		});
		it('Correctly configures routes at the top level', function () {
			expect(app.routes.get[1].path).toBe('/about');
			expect(app.routes.get[1].callbacks.length).toBe(1);
			expect(_.isFunction(app.routes.get[1].callbacks[0])).toBeTruthy();
			expect(app.routes.get[1].regexp.test('/about')).toBeTruthy();
			expect(app.routes.get[1].regexp.test('/about/')).toBeTruthy();
			expect(app.routes.get[1].regexp.test('/')).toBeFalsy();
			expect(app.routes.get[1].regexp.test('//')).toBeFalsy();
			expect(app.routes.get[1].regexp.test('/about/history')).toBeFalsy();
			expect(app.routes.get[1].regexp.test('/about/history/')).toBeFalsy();
			expect(app.routes.get[1].regexp.test('/about/history/early-days')).toBeFalsy();
			expect(app.routes.get[1].regexp.test('/about/history/early-days/')).toBeFalsy();
			expect(app.routes.get[1].regexp.test('/products')).toBeFalsy();
			expect(app.routes.get[1].regexp.test('/products/')).toBeFalsy();
			expect(app.routes.get[1].regexp.test('/products/widget-abc')).toBeFalsy();
			expect(app.routes.get[1].regexp.test('/products/widget-abc/')).toBeFalsy();
			expect(app.routes.get[1].regexp.test('/products/widget-xyz')).toBeFalsy();
			expect(app.routes.get[1].regexp.test('/products/widget-xyz/')).toBeFalsy();
		});
		it('Correctly configures routes at the second level', function () {
			expect(app.routes.get[2].path).toBe('/about/history');
			expect(app.routes.get[2].callbacks.length).toBe(1);
			expect(_.isFunction(app.routes.get[2].callbacks[0])).toBeTruthy();
			expect(app.routes.get[2].regexp.test('/about/history')).toBeTruthy();
			expect(app.routes.get[2].regexp.test('/about/history/')).toBeTruthy();
			expect(app.routes.get[2].regexp.test('/')).toBeFalsy();
			expect(app.routes.get[2].regexp.test('//')).toBeFalsy();
			expect(app.routes.get[2].regexp.test('/about')).toBeFalsy();
			expect(app.routes.get[2].regexp.test('/about/')).toBeFalsy();
			expect(app.routes.get[2].regexp.test('/about/history/early-days')).toBeFalsy();
			expect(app.routes.get[2].regexp.test('/about/history/early-days/')).toBeFalsy();
			expect(app.routes.get[2].regexp.test('/products')).toBeFalsy();
			expect(app.routes.get[2].regexp.test('/products/')).toBeFalsy();
			expect(app.routes.get[2].regexp.test('/products/widget-abc')).toBeFalsy();
			expect(app.routes.get[2].regexp.test('/products/widget-abc/')).toBeFalsy();
			expect(app.routes.get[2].regexp.test('/products/widget-xyz')).toBeFalsy();
			expect(app.routes.get[2].regexp.test('/products/widget-xyz/')).toBeFalsy();
		});
		it('Correctly configures routes at the third level', function () {
			expect(app.routes.get[3].path).toBe('/about/history/early-days');
			expect(app.routes.get[3].callbacks.length).toBe(1);
			expect(_.isFunction(app.routes.get[3].callbacks[0])).toBeTruthy();
			expect(app.routes.get[3].regexp.test('/about/history/early-days')).toBeTruthy();
			expect(app.routes.get[3].regexp.test('/about/history/early-days/')).toBeTruthy();
			expect(app.routes.get[3].regexp.test('/')).toBeFalsy();
			expect(app.routes.get[3].regexp.test('//')).toBeFalsy();
			expect(app.routes.get[3].regexp.test('/about')).toBeFalsy();
			expect(app.routes.get[3].regexp.test('/about/')).toBeFalsy();
			expect(app.routes.get[3].regexp.test('/about/history')).toBeFalsy();
			expect(app.routes.get[3].regexp.test('/about/history/')).toBeFalsy();
			expect(app.routes.get[3].regexp.test('/products')).toBeFalsy();
			expect(app.routes.get[3].regexp.test('/products/')).toBeFalsy();
			expect(app.routes.get[3].regexp.test('/products/widget-abc')).toBeFalsy();
			expect(app.routes.get[3].regexp.test('/products/widget-abc/')).toBeFalsy();
			expect(app.routes.get[3].regexp.test('/products/widget-xyz')).toBeFalsy();
			expect(app.routes.get[3].regexp.test('/products/widget-xyz/')).toBeFalsy();
		});
		it('Correctly configures routes for a non-default controller', function () {
			expect(app.routes.get[4].path).toBe('/products');
			expect(app.routes.get[4].callbacks.length).toBe(1);
			expect(_.isFunction(app.routes.get[4].callbacks[0])).toBeTruthy();
			expect(app.routes.get[4].regexp.test('/products')).toBeTruthy();
			expect(app.routes.get[4].regexp.test('/products/')).toBeTruthy();
			expect(app.routes.get[4].regexp.test('/')).toBeFalsy();
			expect(app.routes.get[4].regexp.test('//')).toBeFalsy();
			expect(app.routes.get[4].regexp.test('/about')).toBeFalsy();
			expect(app.routes.get[4].regexp.test('/about/')).toBeFalsy();
			expect(app.routes.get[4].regexp.test('/about/history')).toBeFalsy();
			expect(app.routes.get[4].regexp.test('/about/history/')).toBeFalsy();
			expect(app.routes.get[4].regexp.test('/about/history/early-days')).toBeFalsy();
			expect(app.routes.get[4].regexp.test('/about/history/early-days/')).toBeFalsy();
			expect(app.routes.get[4].regexp.test('/products/widget-abc')).toBeFalsy();
			expect(app.routes.get[4].regexp.test('/products/widget-abc/')).toBeFalsy();
			expect(app.routes.get[4].regexp.test('/products/widget-xyz')).toBeFalsy();
			expect(app.routes.get[4].regexp.test('/products/widget-xyz/')).toBeFalsy();
		});
		it('Correctly configures routes with slugs', function () {
			expect(app.routes.get[5].path).toBe('/products/:product');
			expect(app.routes.get[5].callbacks.length).toBe(1);
			expect(_.isFunction(app.routes.get[5].callbacks[0])).toBeTruthy();
			expect(app.routes.get[5].regexp.test('/products/widget-abc')).toBeTruthy();
			expect(app.routes.get[5].regexp.test('/products/widget-abc/')).toBeTruthy();
			expect(app.routes.get[5].regexp.test('/products/widget-xyz')).toBeTruthy();
			expect(app.routes.get[5].regexp.test('/products/widget-xyz/')).toBeTruthy();
			expect(app.routes.get[5].regexp.test('/')).toBeFalsy();
			expect(app.routes.get[5].regexp.test('//')).toBeFalsy();
			expect(app.routes.get[5].regexp.test('/about')).toBeFalsy();
			expect(app.routes.get[5].regexp.test('/about/')).toBeFalsy();
			expect(app.routes.get[5].regexp.test('/about/history')).toBeFalsy();
			expect(app.routes.get[5].regexp.test('/about/history/')).toBeFalsy();
			expect(app.routes.get[5].regexp.test('/about/history/early-days')).toBeFalsy();
			expect(app.routes.get[5].regexp.test('/about/history/early-days/')).toBeFalsy();
			expect(app.routes.get[5].regexp.test('/products')).toBeFalsy();
			expect(app.routes.get[5].regexp.test('/products/')).toBeFalsy();
		});
		afterEach(function () {
			app.dispose();
		});
	});
}(require('lodash'), require('../../../index')));
