/*jslint node: true, nomen: true, white: true, todo: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, fs, mkdirp) {
	"use strict";

	module.exports = function (options) {
		var convertKey = function (key) {
				return key.replace(/^\//, '').replace(/\//g, '_') + options.extension;
			};

		// TODO Put these defaults into an external file and load them
		options = _.merge({ extension: '.json', encoding: 'utf8' }, options);
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
				console.log(filePath);
				fs.readFile(filePath, { encoding: options.encoding }, function (error, value) {
					if (_.isString(value)) {
						// TODO Make this correctly handle malformed JSON
						value = JSON.parse(value);
					}
					callback(error, value);
				});
			},

			remove: function (type, key, callback) {
				var filePath = path.join(options.root, type, convertKey(key));
				fs.unlink(filePath, function (error) {
					callback(error);
				});
			}
		};
	};
}(require('lodash'), require('path'), require('fs'), require('mkdirp')));
