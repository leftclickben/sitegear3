/*jslint node: true, nomen: true, white: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, events) {
	"use strict";

	module.exports = function (adapter, type, model, validators) {
		model = model || {};
		validators = validators || [];

		var repository = _.extend(new events.EventEmitter(), {
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
					return this;
				},

				set: function (key, value, callback) {
					callback = callback || _.noop;
					return this.validate(value, function () {
						adapter.set(type, key, value, function (error) {
							callback(error);
							if (error) {
								repository.emit('error', error);
							} else {
								repository.emit('set', type, key, value);
							}
						});
					});
				},

				get: function (key, callback) {
					callback = callback || _.noop;
					adapter.get(type, key, function (error, value) {
						if (value) {
							value = _.merge({}, model, value);
						}
						callback(error, value);
						if (error) {
							repository.emit('error', error);
						} else {
							repository.emit('get', type, key, value);
						}
					});
					return this;
				},

				keys: function (callback) {
					callback = callback || _.noop;
					adapter.keys(type, function (error, keys) {
						callback(error, keys);
						if (error) {
							repository.emit('error', error);
						} else {
							repository.emit('keys', type, null, keys);
						}
					});
					return this;
				},

				all: function (callback) {
					callback = callback || _.noop;
					adapter.all(type, function (error, data) {
						callback(error, data);
						if (error) {
							repository.emit('error', error);
						} else {
							repository.emit('all', type, null, data);
						}
					});
					return this;
				},

				remove: function (key, callback) {
					callback = callback || _.noop;
					adapter.remove(type, key, function (error) {
						callback(error);
						if (error) {
							repository.emit('error', error);
						} else {
							repository.emit('remove', type, key);
						}
					});
					return this;
				},

				clear: function (callback) {
					callback = callback || _.noop;
					adapter.clear(type, function (error) {
						callback(error);
						if (error) {
							repository.emit('error', error);
						} else {
							repository.emit('clear', type);
						}
					});
					return this;
				}
			});
		return repository;
	};
}(require('lodash'), require('events')));
