/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function () {
	"use strict";

	module.exports = function () {
		return function (request, response, next) {
			response.status(404);
			if (request.accepts('html')) {
				response.render('_errors/404', { status: 'Not Found' });
			} else if (request.accepts('json')) {
				response.send({ status: 'Not Found' });
			} else {
				response.type('txt').send('Not Found');
			}
		};
	};
}());
