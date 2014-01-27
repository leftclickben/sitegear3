/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (sitegear3) {
	"use strict";
	require('../setupTests');

	describe('Sitegear3 application lifecycle: dispose()', function () {
		var app;
		beforeEach(function () {
			app = sitegear3().initialise(require('../settings.json')).persistence();
			spyOn(app.redis, 'end').andCallThrough();
			app.dispose();
		});
		it('Calls end() on the redis client', function () {
			expect(app.redis.end).toHaveBeenCalled();
			expect(app.redis.end.callCount).toBe(1);
		});
	});
}(require('../../../index')));
