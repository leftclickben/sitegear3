/*jslint node: true, nomen: true, white: true, todo: true*/
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
			define: function (type /*, validator, validator, ... */) {
				if (repositories[type]) {
					throw new Error('Repository "' + type + '" already exists.');
				}

				var validators = Array.prototype.slice.call(arguments, 1);

				// Instantiate on first access
				repositories[type] = _.extend(new events.EventEmitter(), {
					validate: function (value, callback) {
						callback = callback || _.noop;
						var index = 0,
							next = function () {
								if (index < validators.length) {
									validators[index](value, function (error) {
										index = index + 1;
										if (error) {
											callback(error);
										} else {
											next();
										}
									});
								} else {
									callback();
								}
							};
						next();
						return repositories[type];
					},

					set: function (key, value, callback) {
						callback = callback || _.noop;
						return this.validate(value, function () {
							driver.set(type, key, value, function (error) {
								callback(error);
								if (error) {
									repositories[type].emit('error', error);
								} else {
									repositories[type].emit('set', type, key, value);
								}
							});
						});
					},

					get: function (key, callback) {
						callback = callback || _.noop;
						driver.get(type, key, function (error, value) {
							callback(error, value);
							if (error) {
								repositories[type].emit('error', error);
							} else {
								repositories[type].emit('get', type, key, value);
							}
						});
						return repositories[type];
					},

					keys: function (callback) {
						callback = callback || _.noop;
						driver.keys(type, function (error, keys) {
							callback(error, keys);
							if (error) {
								repositories[type].emit('error', error);
							} else {
								repositories[type].emit('keys', type, null, keys);
							}
						});
						return repositories[type];
					},

					all: function (callback) {
						callback = callback || _.noop;
						driver.all(type, function (error, data) {
							callback(error, data);
							if (error) {
								repositories[type].emit('error', error);
							} else {
								repositories[type].emit('all', type, null, data);
							}
						});
						return repositories[type];
					},

					remove: function (key, callback) {
						callback = callback || _.noop;
						driver.remove(type, key, function (error) {
							callback(error);
							if (error) {
								repositories[type].emit('error', error);
							} else {
								repositories[type].emit('remove', type, key);
							}
						});
						return repositories[type];
					}

					// TODO clear()
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
