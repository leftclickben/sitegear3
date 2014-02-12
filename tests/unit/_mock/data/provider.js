/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (mockRepository) {
	"use strict";

	module.exports = function () {
		var repositories = {};

		return {
			define: function (type) {
				if (repositories[type]) {
					throw new Error('Attempting to create repository "' + type + '" twice');
				}
				repositories[type] = mockRepository();
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
}(require('./repository')));
