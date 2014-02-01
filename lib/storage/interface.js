/*jslint node: true, nomen: true, white: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, events) {
	"use strict";

	/**
	 * Storage interface for sitegear3.
	 * @param driver function The driver function, which must return an object that provides the methods specified in
	 *   the Storage Driver API.
	 * @returns {Object}
	 */
	module.exports = function (driver) {
		var callbackWrapper = function (storage, callback, eventType) {
				return function (error, type, key, value) {
					if (error) {
						callback(error, type, key, value);
						storage.emit('error', error);
					} else {
						callback(null, type, key, value);
						storage.emit(eventType, type, key, value);
					}
				};
			};

		return _.extend(new events.EventEmitter(), {
			set: function (type, key, value, callback) {
				driver.set(type, key, value, callbackWrapper(this, callback, 'set'));
				return this;
			},

			get: function (type, key, callback) {
				driver.get(type, key, callbackWrapper(this, callback, 'get'));
				return this;
			},

			remove: function (type, key, callback) {
				driver.remove(type, key, callbackWrapper(this, callback, 'remove'));
				return this;
			}
		});
	};
}(require('lodash'), require('events')));
