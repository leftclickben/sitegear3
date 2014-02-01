/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, utils) {
	"use strict";

	module.exports = {
		settings: utils.expandSettings(_.merge({}, require('../../../lib/defaults.json'), require('../settings.json'))),
		locals: {},
		start: _.noop,
		stop: _.noop,
		get: function (key) {
			return this.settings[key];
		},
		interfaces: {
			storage: {
				set: function (type, key, value, callback) {
					callback();
				},
				get: function (type, key, callback) {
					callback(undefined, 'this is the value');
				},
				remove: function (type, key, callback) {
					callback();
				}
			}
		}
	};
}(require('lodash'), require('../../../lib/utils')));
