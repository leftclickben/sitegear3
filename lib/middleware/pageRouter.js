/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (path, fs) {
	"use strict";

	module.exports = function (templatesPath) {
		// TODO Kill this, use the router from express
		return function (request, response, next) {
			if (fs.existsSync(path.join(templatesPath, request.path + '.html')) || fs.existsSync(path.join(templatesPath, request.path, 'index.html'))) {
				response.render(request.path.replace(/^\//, ''));
			} else {
				next();
			}
		};
	};
}(require('path'), require('fs')));
