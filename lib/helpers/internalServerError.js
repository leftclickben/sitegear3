/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_) {
	"use strict";

	module.exports = function () {
		return function (error, request, response, next) {
			console.log('Internal Server Error: ', error);
			response.status(error.status || 500);
			if (request.accepts('html')) {
				response.render('_errors/500', { status: 'Internal Server Error', error: error });
			} else if (request.accepts('json')) {
				response.send({ status: 'Internal Server Error', error: error });
			} else {
				response.type('txt').send('Internal Server Error: ' + error);
			}
		};
	};
}(require('lodash')));
