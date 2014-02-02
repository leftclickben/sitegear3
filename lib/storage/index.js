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
							driver.set(type, key, value, function (error) {
								if (_.isFunction(callback)) {
									callback(error);
								}
								if (error) {
									collections[type].emit('error', error);
								} else {
									collections[type].emit('set', type, key, value);
								}
							});
							return collections[type];
						},

						get: function (key, callback) {
							driver.get(type, key, function (error, value) {
								if (_.isFunction(callback)) {
									callback(error, value);
								}
								if (error) {
									collections[type].emit('error', error);
								} else {
									collections[type].emit('get', type, key, value);
								}
							});
							return collections[type];
						},

						keys: function (callback) {
							driver.keys(type, function (error, keys) {
								if (_.isFunction(callback)) {
									callback(error, keys);
								}
								if (error) {
									collections[type].emit('error', error);
								} else {
									collections[type].emit('keys', type, null, keys);
								}
							});
							return collections[type];
						},

						all: function (callback) {
							driver.all(type, function (error, data) {
								if (_.isFunction(callback)) {
									callback(error, data);
								}
								if (error) {
									collections[type].emit('error', error);
								} else {
									collections[type].emit('all', type, null, data);
								}
							});
							return collections[type];
						},

						remove: function (key, callback) {
							driver.remove(type, key, function (error) {
								if (_.isFunction(callback)) {
									callback(error);
								}
								if (error) {
									collections[type].emit('error', error);
								} else {
									collections[type].emit('remove', type, key);
								}
							});
							return collections[type];
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
