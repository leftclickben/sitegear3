/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, events) {
	"use strict";

	module.exports = function () {
		return _.extend(new events.EventEmitter(), {
			validate: function (value, callback) {
				callback();
			},
			set: function (key, value, callback) {
				callback();
			},
			get: function (key, callback) {
				callback(undefined, { 'test-key': 'this is the value' });
			},
			all: function (key, callback) {
				callback(undefined, { 'test-key': 'this is the value' });
			},
			remove: function (key, callback) {
				callback();
			}
		});
	};
}(require('lodash'), require('events')));
