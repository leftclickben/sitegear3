/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3) {
	"use strict";

	module.exports = function (app) {
		app.settings.session.key = app.settings.session.baseKey + '.' + app.settings.site.key;
		return sitegear3.cookieSession(app.settings.session);
	};
}(require('lodash'), require('../sitegear3')));

