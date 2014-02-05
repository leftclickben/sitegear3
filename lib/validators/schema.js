/*jslint node: true, nomen: true, white: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, JaySchema) {
	"use strict";

	var js = new JaySchema();

	module.exports = function (schema) {
		return function (data, callback) {
			js.validate(data, schema, function (errors) {
				if (errors) {
					var message = _.map(errors, function (error) {
							return error.message;
						}).join('"; "');
					callback(new Error('Received ' + errors.length + ' errors from JSON schema validator: "' + message + '"'));
				} else {
					callback();
				}
			});
		};
	};
}(require('lodash'), require('jayschema')));
