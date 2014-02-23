/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_) {
	"use strict";

	module.exports = function () {
		var server = {
			listen: function (port, callback) {
				process.nextTick(callback);
				return server;
			},
			close: function(callback) {
				process.nextTick(callback);
				return server;
			}
		};
		return server;
	};
}(require('lodash')));
