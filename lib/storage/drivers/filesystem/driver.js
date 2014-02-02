/*jslint node: true, nomen: true, white: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, fs, mkdirp, defaults) {
	"use strict";

	module.exports = function (options) {
		var convertKey = function (key) {
				return key.replace(/^\//, '').replace(/\//g, '_') + options.extension;
			};

		options = _.merge(defaults, options);
		return {
			set: function (type, key, value, callback) {
				var parentPath = path.join(options.root, type),
					filePath = path.join(parentPath, convertKey(key));
				mkdirp(parentPath, function (mkdirError) {
					if (mkdirError) {
						callback(mkdirError);
					} else {
						if (!_.isString(value)) {
							value = JSON.stringify(value, null, '\t');
						}
						fs.writeFile(filePath, value, { encoding: options.encoding }, function (writeFileError) {
							callback(writeFileError);
						});
					}
				});
			},

			get: function (type, key, callback) {
				var filePath = path.join(options.root, type, convertKey(key));
				fs.readFile(filePath, { encoding: options.encoding }, function (error, value) {
					if (_.isString(value)) {
						try {
							value = JSON.parse(value);
						} catch (parseError) {
							callback(parseError);
						}
					}
					if (error && error.code === 'ENOENT') {
						error = null;
					}
					callback(error, value);
				});
			},

			keys: function (type, callback) {
				var parentPath = path.join(options.root, type);
				fs.readdir(parentPath, function (error, files) {
					callback(error, files);
				});
			},

			remove: function (type, key, callback) {
				var filePath = path.join(options.root, type, convertKey(key));
				fs.unlink(filePath, function (error) {
					if (error && error.code === 'ENOENT') {
						error = null;
					}
					callback(error);
				});
			}
		};
	};
}(require('lodash'), require('path'), require('fs'), require('mkdirp'), require('./defaults.json')));
