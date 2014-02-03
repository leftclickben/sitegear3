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
		var repositories = {};
		return {
			define: function (type) {
				if (repositories[type]) {
					throw new Error('Repository "' + type + '" already exists.');
				}
				// Instantiate on first access
				repositories[type] = _.extend(new events.EventEmitter(), {
					set: function (key, value, callback) {
						driver.set(type, key, value, function (error) {
							if (_.isFunction(callback)) {
								callback(error);
							}
							if (error) {
								repositories[type].emit('error', error);
							} else {
								repositories[type].emit('set', type, key, value);
							}
						});
						return repositories[type];
					},

					get: function (key, callback) {
						driver.get(type, key, function (error, value) {
							if (_.isFunction(callback)) {
								callback(error, value);
							}
							if (error) {
								repositories[type].emit('error', error);
							} else {
								repositories[type].emit('get', type, key, value);
							}
						});
						return repositories[type];
					},

					keys: function (callback) {
						driver.keys(type, function (error, keys) {
							if (_.isFunction(callback)) {
								callback(error, keys);
							}
							if (error) {
								repositories[type].emit('error', error);
							} else {
								repositories[type].emit('keys', type, null, keys);
							}
						});
						return repositories[type];
					},

					all: function (callback) {
						driver.all(type, function (error, data) {
							if (_.isFunction(callback)) {
								callback(error, data);
							}
							if (error) {
								repositories[type].emit('error', error);
							} else {
								repositories[type].emit('all', type, null, data);
							}
						});
						return repositories[type];
					},

					remove: function (key, callback) {
						driver.remove(type, key, function (error) {
							if (_.isFunction(callback)) {
								callback(error);
							}
							if (error) {
								repositories[type].emit('error', error);
							} else {
								repositories[type].emit('remove', type, key);
							}
						});
						return repositories[type];
					}
				});
				repositories[type].on('error', function (error) {
					console.log('Storage interface encountered an error: ' + error);
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
}(require('lodash'), require('events')));
