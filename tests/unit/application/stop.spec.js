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

	describe('Sitegear3 application lifecycle: start()', function () {
		var app;
		beforeEach(function () {
			app = sitegear3().initialise(require('../settings.json')).start(8888);
			spyOn(app.server, 'close').andCallThrough();
			app.stop();
		});
		it('Calls close() on http server', function () {
			expect(app.server.close).toHaveBeenCalled();
			expect(app.server.close.callCount).toBe(1);
		});
	});
}(require('../../../index')));
