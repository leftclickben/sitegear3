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
			page: function () {
				return function (request, response) {
					var fragments = { main: request.path, title: request.path };
					response.render('index', { fragments: fragments });
				}
			}
		}
	};
}());
