/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function () {
	"use strict";

	// The mock caches repositories as app.storage.repository('blah') is called in the module code and in the test.
	// TODO This doesn't smell right FIXME
	var repositories = {};
	module.exports = function () {
		return {
			repository: function (type) {
				if (!repositories[type]) {
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
				}
				return repositories[type];
			}
		};
	};
}());
