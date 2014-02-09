/*jslint node: true, nomen: true, white: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, repository) {
	"use strict";

	module.exports = function (connector) {
		var repositories = {};
		return {
			define: function (type, model /*, validator, validator, ... */) {
				if (!type) {
					throw new Error('Cannot define() repository without specifying a type name');
				}
				if (repositories[type]) {
					throw new Error('Repository "' + type + '" already exists.');
				}

				var validators;
				if (_.isFunction(model)) {
					validators = Array.prototype.slice.call(arguments, 1);
					model = null;
				} else {
					validators = Array.prototype.slice.call(arguments, 2);
				}

				repositories[type] = repository(connector, type, model, validators).on('error', function (error) {
					console.log('Data provider encountered an error: ' + error);
				});
				return repositories[type];
			},

			repository: function (type) {
				if (!repositories[type]) {
					throw new Error('Attempting to retrieve unregistered repository "' + type + '"');
				}
				return repositories[type];
			}
		};
	};
}(require('lodash'), require('./repository')));
