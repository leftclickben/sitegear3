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
				response.render('_errors/404');
			} else if (request.accepts('json')) {
				response.send({ error: 'Not found' });
			} else {
				response.type('txt').send('Not found');
			}
		};
	};
}());
