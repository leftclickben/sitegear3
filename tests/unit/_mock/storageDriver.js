/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function () {
	"use strict";

	module.exports = function () {
		return {
			set: function (type, key, value, callback) {
				callback(null, type, key, value);
			},

			get: function (type, key, callback) {
				callback(null, type, key, 'this is the value');
			},

			remove: function (type, key, callback) {
				callback(null, type, key);
			}
		};
	};
}());
