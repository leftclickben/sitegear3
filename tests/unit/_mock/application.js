/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, utils, mockMediator) {
	"use strict";

	module.exports = function () {
		return 	{
			settings: utils.expandSettings(_.merge({}, require('../../../lib/defaults.json'), require('../_input/settings.json'))),
			locals: {},
			start: _.noop,
			stop: _.noop,
			get: function (key) {
				return this.settings[key];
			},
			data: mockMediator()
		};
	};
}(require('lodash'), require('../../../lib/utils'), require('./mediator')));
