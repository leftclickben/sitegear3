/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (sitegear3) {
	"use strict";

	describe('Sitegear3 application lifecycle: dispose()', function () {
		var app;
		beforeEach(function () {
			app = sitegear3();
			app.initialise();
			app.persistence();
			app.start();
			spyOn(app.redis, 'end').andCallThrough();
			app.dispose();
		});
		it('Calls end() on the redis client', function () {
			expect(app.redis.end).toHaveBeenCalled();
		});
	});
}(require('../index')));
