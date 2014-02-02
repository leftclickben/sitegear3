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
		var collections = {};
		return {
			collection: function (type) {
				if (!collections[type]) {
					// Instantiate on first access
					collections[type] = _.extend(new events.EventEmitter(), {
						set: function (key, value, callback) {
							var storage = this;
							driver.set(type, key, value, function (error) {
								if (_.isFunction(callback)) {
									callback(error);
								}
								if (error) {
									storage.emit('error', error);
								} else {
									storage.emit('set', type, key, value);
								}
							});
							return this;
						},

						get: function (key, callback) {
							var storage = this;
							driver.get(type, key, function (error, value) {
								if (_.isFunction(callback)) {
									callback(error, value);
								}
								if (error) {
									storage.emit('error', error);
								} else {
									storage.emit('get', type, key, value);
								}
							});
							return this;
						},

						remove: function (key, callback) {
							var storage = this;
							driver.remove(type, key, function (error) {
								if (_.isFunction(callback)) {
									callback(error);
								}
								if (error) {
									storage.emit('error', error);
								} else {
									storage.emit('remove', type, key);
								}
							});
							return this;
						}
					});
					collections[type].on('error', function (error) {
						console.log('Storage interface encountered an error: ' + error);
					});
				}
				return collections[type];
			}
		};
	};
}(require('lodash'), require('events')));
