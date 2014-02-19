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
		var app, mockConnector;
		beforeEach(function () {
			mockConnector = require('../_mock/data/connector');
			app = sitegear3(require('../settings.json')).connect(mockConnector());
		});
		it('Instantiates the data provider', function () {
			expect(app.data).toBeDefined();
		});
	});
}(require('lodash'), require('../../../index')));
