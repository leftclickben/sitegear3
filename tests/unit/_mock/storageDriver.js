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
				callback();
			},

			get: function (type, key, callback) {
				callback(undefined, 'this is the value');
			},

			keys: function (type, callback) {
				callback(undefined, [ 'key1', 'key2' ]);
			},

			remove: function (type, key, callback) {
				callback();
			}
		};
	};
}());
