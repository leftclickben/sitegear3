/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, utils) {
	"use strict";

	module.exports = function () {
		return 	{
			settings: utils.expandSettings(_.merge({}, require('../../../lib/defaults.json'), require('../settings.json'))),
			locals: {},
			start: _.noop,
			stop: _.noop,
			get: function (key) {
				return this.settings[key];
			},
			storage: require('./storageInterface')()
		};
	};
}(require('lodash'), require('../../../lib/utils')));
