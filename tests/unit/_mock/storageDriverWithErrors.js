/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function () {
	"use strict";

	module.exports = function (options) {
		return {
			set: function (type, key, value, callback) {
				callback(options.error, type, key, value);
			},

			get: function (type, key, callback) {
				callback(options.error, type, key);
			},

			remove: function (type, key, callback) {
				callback(options.error, type, key);
			}
		};
	};
}());
