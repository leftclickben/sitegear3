/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, fs) {
	"use strict";

	module.exports = function (app, dirname) {
		dirname = dirname || path.join(__dirname, '..', 'viewHelpers');
		return function (request, response, next) {
			app.locals.baseUrl = app.settings.server.baseUrl;
			app.locals.currentDate = new Date();

			_.each(fs.readdirSync(dirname), function (filename) {
				if (/\.js$/.test(filename)) {
					var name = path.basename(filename, '.js');
					app.locals[name] = require('../viewHelpers/' + filename);
				}
			});
			next();
		};
	};
}(require('lodash'), require('path'), require('fs')));
