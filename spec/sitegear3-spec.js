/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, redis) {
	"use strict";

	describe('Sitegear3 application lifecycle', function () {
		var app;
		beforeEach(function () {
			app = sitegear3();
		});
		describe('app.setup()', function () {
			beforeEach(function () {
				app.initialise({ site: { name: 'Test Spec', additionalKey: 'value' }, foo: 'bar' });
			});
			it('Should apply settings over defaults', function () {
				expect(app.settings.site.name).toBe('Test Spec');
				expect(app.settings.site.additionalKey).toBe('value');
				expect(app.settings.site.baseUrl).toBe('http://localhost/');
				expect(app.settings.foo).toBe('bar');
			});
			it('Should load controllers', function () {
				expect(_.isFunction(app.controllers.default)).toBeTruthy();
				expect(_.size(app.controllers)).toBe(2);
			});
			afterEach(function () {
				app.dispose();
			});
		});
		describe('app.mapRoutes()', function () {
			beforeEach(function () {
				app.initialise();
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
			it('Should add all expected routes', function () {
				expect(_.size(app.routes.get)).toBe(6);
				expect(_.size(app.routes.post)).toBe(0);
				expect(_.size(app.routes.put)).toBe(0);
				expect(_.size(app.routes.dele)).toBe(0);
			});
			it('Should correctly configure the home page route', function () {
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
			it('Should correctly configure routes at the top level', function () {
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
			it('Should correctly configure routes at the second level', function () {
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
			it('Should correctly configure routes at the third level', function () {
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
			it('Should correctly configure routes for a non-default controller', function () {
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
			it('Should correctly configure routes with slugs', function () {
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
		describe('app.connect() with default settings', function () {
			beforeEach(function () {
				app.initialise();
				spyOn(redis, 'createClient').andCallThrough();
				app.connect();
			});
			it('Should have called redis.createClient()', function () {
				expect(redis.createClient).toHaveBeenCalled();
			});
			describe('Should have a working connection', function () {
				var key = 'test_spec_' + Date.now(),
					value = 'test: passed';
				it('Should allow values to be set, retrieved and deleted', function (done) {
					app.redis.set(key, value, function (err, result) {
						var delCallback = function (err, result) {
								expect(err).toBeNull();
								expect(result).toBe(1);
								done();
							},
							getCallback = function (err, result) {
								expect(err).toBeNull();
								expect(result).toBe(value);
								app.redis.del(key, delCallback);
							};
						expect(err).toBeNull();
						expect(result).toBe('OK');
						app.redis.get(key, getCallback);
					});
				});
			});
			afterEach(function () {
				app.dispose();
			});
		});
		describe('app.start()', function () {
			beforeEach(function () {
				app.initialise();
				spyOn(app, 'listen');
				app.start();
			});
			it('Should have called listen()', function () {
				expect(app.listen).toHaveBeenCalled();
			});
			afterEach(function () {
				app.dispose();
			});
		});
		describe('app.dispose()', function () {
			beforeEach(function () {
				app.initialise();
				app.connect();
				app.start();
				spyOn(app.redis, 'end').andCallThrough();
				app.dispose();
			});
			it('Should have called end() on the redis client', function () {
				expect(app.redis.end).toHaveBeenCalled();
			});
		});
	});
}(require('lodash'), require('../index'), require('redis')));
