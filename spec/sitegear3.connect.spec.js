/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (sitegear3, redis) {
	"use strict";

	describe('Sitegear3 application lifecycle: connect()', function () {
		var app;
		beforeEach(function () {
			app = sitegear3();
			app.initialise();
			spyOn(redis, 'createClient').andCallThrough();
			app.connect();
		});
		it('Calls redis.createClient()', function () {
			expect(redis.createClient).toHaveBeenCalled();
		});
		describe('Has a working connection', function () {
			var key = 'test_spec_' + Date.now(),
				value = 'test: passed';
			it('Allows values to be set, retrieved and deleted', function (done) {
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
}(require('../index'), require('redis')));
