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

	describe('Application lifecycle: connect()', function () {
		var app, mockAdapter;
		beforeEach(function () {
			mockAdapter = require('../_mock/data/adapter');
			app = sitegear3(require('../settings.json')).connect(mockAdapter());
		});
		it('Instantiates the data mediator', function () {
			expect(app.data).toBeDefined();
		});
	});
}(require('lodash'), require('../../../index')));
