/*jslint node: true, nomen: true, white: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (path, fs, mkdirp) {
	"use strict";

	module.exports = function (options) {
		return {
			set: function (type, key, value, callback) {
				var parentPath = path.join(options.root, type),
					filePath = path.join(parentPath, key);
				mkdirp(parentPath, function (mkdirError) {
					if (mkdirError) {
						callback(mkdirError, type, key, value);
					} else {
						fs.writeFile(filePath, value, function (writeFileError) {
							callback(writeFileError, type, key, value);
						});
					}
				});
			},

			get: function (type, key, callback) {
				var filePath = path.join(options.root, type, key);
				fs.readFile(filePath, function (error, value) {
					callback(error, type, key, value);
				});
			},

			remove: function (type, key, callback) {
				var filePath = path.join(options.root, type, key);
				fs.unlink(filePath, function (error) {
					callback(error, type, key);
				});
			}
		};
	};
}(require('path'), require('fs'), require('mkdirp')));
