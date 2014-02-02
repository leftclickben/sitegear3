/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function () {
	"use strict";

	var collections = {};

	module.exports = function () {
		return {
			collection: function (type) {
				if (!collections[type]) {
					collections[type] = {
						set: function (key, value, callback) {
							callback();
						},
						get: function (key, callback) {
							callback(undefined, 'this is the value');
						},
						remove: function (key, callback) {
							callback();
						}
					};
				}
				return collections[type];
			}
		};
	};
}());
