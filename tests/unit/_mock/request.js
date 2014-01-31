/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function () {
	"use strict";

	module.exports = {
		path: '/some/url/path',
		originalUrl: 'http://localhost:8080/some/url/path',
		secure: false,
		accepts: function () {
			return false;
		},
		cookies: {
			"sitegear3.session.test-spec": []
		}
	};
}());
