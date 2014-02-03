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
		return {
			repository: function (type) {
				var repository = _.extend(new events.EventEmitter(), {
						set: function (key, value, callback) {
							driver.set(type, key, value, function (error) {
								if (_.isFunction(callback)) {
									callback(error);
								}
								if (error) {
									repository.emit('error', error);
								} else {
									repository.emit('set', type, key, value);
								}
							});
							return repository;
						},

						get: function (key, callback) {
							driver.get(type, key, function (error, value) {
								if (_.isFunction(callback)) {
									callback(error, value);
								}
								if (error) {
									repository.emit('error', error);
								} else {
									repository.emit('get', type, key, value);
								}
							});
							return repository;
						},

						keys: function (callback) {
							driver.keys(type, function (error, keys) {
								if (_.isFunction(callback)) {
									callback(error, keys);
								}
								if (error) {
									repository.emit('error', error);
								} else {
									repository.emit('keys', type, null, keys);
								}
							});
							return repository;
						},

						all: function (callback) {
							driver.all(type, function (error, data) {
								if (_.isFunction(callback)) {
									callback(error, data);
								}
								if (error) {
									repository.emit('error', error);
								} else {
									repository.emit('all', type, null, data);
								}
							});
							return repository;
						},

						remove: function (key, callback) {
							driver.remove(type, key, function (error) {
								if (_.isFunction(callback)) {
									callback(error);
								}
								if (error) {
									repository.emit('error', error);
								} else {
									repository.emit('remove', type, key);
								}
							});
							return repository;
						}
					});
				repository.on('error', function (error) {
					console.log('Storage interface encountered an error: ' + error);
				});
				return repository;
			}
		};
	};
}(require('lodash'), require('events')));
