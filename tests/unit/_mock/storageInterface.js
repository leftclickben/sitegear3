/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function () {
	"use strict";

	module.exports = function () {
		var repositories = {};

		return {
			define: function (type) {
				if (repositories[type]) {
					throw new Error('Attempting to create repository "' + type + '" twice');
				}
				repositories[type] = {
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
				return repositories[type];
			},

			repository: function (type) {
				if (!type) {
					throw new Error('Attempting to retrieve unregistered repository "' + type + '"');
				}
				return repositories[type];
			}
		};
	};
}());
