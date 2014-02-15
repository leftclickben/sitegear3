/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_) {
	"use strict";

	module.exports = function (callback) {
		callback = callback || function (error, request, response) {
			console.log('Internal Server Error: ', error);
			console.log(error.stack);
		};
		return function (error, request, response, next) {
			callback(error, request, response);
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
