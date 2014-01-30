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
			app = sitegear3();
			app.initialise(require('../settings.json'));
			spyOn(app, 'listen');
			app.start();
		});
		it('Calls listen()', function () {
			expect(app.listen).toHaveBeenCalled();
			expect(app.listen.callCount).toBe(1);
		});
		afterEach(function () {
			app.stop();
		});
	});
}(require('../../../index')));
