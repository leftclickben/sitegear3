/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, redis) {
	"use strict";
	require('../setupTests');

	describe('Sitegear3 application lifecycle: persistence()', function () {
		var app;
		beforeEach(function () {
			spyOn(redis, 'createClient').andCallFake(function () {
				return {
					on: _.noop,
					dispose: _.noop
				};
			});
			app = sitegear3().initialise(require('../settings.json')).persistence();
		});
		it('Calls redis.createClient()', function () {
			expect(redis.createClient).toHaveBeenCalled();
			expect(redis.createClient.callCount).toBe(1);
		});
		afterEach(function () {
			app.stop();
		});
	});
}(require('lodash'), require('../../../index'), require('redis')));
