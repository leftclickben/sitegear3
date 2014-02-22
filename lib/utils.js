/*jslint node: true, nomen: true, white: true, unparam: true, stupid: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, glob) {
	"use strict";

	module.exports = {
		/**
		 * For all files matching globPattern, require() the file and assign it as a getter on destination, with a name
		 * determined using namePattern.  When all files are processed, call the callback.
		 *
		 * Valid call signatures:
		 *
		 * globGetters(myObject, nameRegex, globPattern, globOptions, function () { ... });
		 * globGetters(myObject, globPattern, globOptions, function () { ... });
		 * globGetters(nameRegex, globPattern, globOptions, function () { ... });
		 * globGetters(myObject, nameRegex, globPattern, globOptions);
		 * globGetters(globPattern, globOptions, function () { ... });
		 * globGetters(myObject, globPattern, globOptions);
		 * globGetters(nameRegex, globPattern, globOptions);
		 * globGetters(globPattern, globOptions);
		 *
		 * @param [destination] Object to populate.  If omitted, an empty object will be created.
		 * @param [nameRegex] The name of the getter is generated using this RegExp on the full file path of each
		 *   matched file.  The name is the first matched capturing group.  Default:
		 *   /\/([a-zA-Z0-9_\-\.]+)\.js$/
		 * @param globPattern The glob pattern used to find files to load. (Required)
		 * @param globOptions Options passed to the glob() function. (Required)
		 * @param callback (Required)
		 *
		 * @return Result of glob()
		 */
		globGetters: function (destination, nameRegex, globPattern, globOptions, callback) {
			switch (arguments.length) {
				case 2:
					callback = _.noop;
					globOptions = nameRegex;
					globPattern = destination;
					nameRegex = /\/([a-zA-Z0-9_\-\.]+)\.js$/;
					destination = {};
					break;
				case 3:
					if (_.isFunction(globPattern)) {
						callback = globPattern;
						globOptions = nameRegex;
						globPattern = destination;
						nameRegex = /\/([a-zA-Z0-9_\-\.]+)\.js$/;
						destination = {};
					} else {
						callback = _.noop;
						globOptions = globPattern;
						globPattern = nameRegex;
						if (_.isPlainObject(destination)) {
							nameRegex = /\/([a-zA-Z0-9_\-\.]+)\.js$/;
						} else {
							nameRegex = destination;
							destination = {};
						}
					}
					break;
				case 4:
					if (_.isFunction(globOptions)) {
						callback = globOptions;
						globOptions = globPattern;
						globPattern = nameRegex;
						if (_.isPlainObject(destination)) {
							nameRegex = /\/([a-zA-Z0-9_\-\.]+)\.js$/;
						} else {
							nameRegex = destination;
							destination = {};
						}
					} else {
						callback = _.noop;
					}
					break;
			}
			var files,
				exposeGetters = function (error, files) {
					if (files && !error) {
						_.each(files, function (filename) {
							if (/\.js/.test(filename)) {
								var matches = nameRegex.exec(filename),
									name = matches && matches.length > 1 ? matches[1] : null;
								if (name === null) {
									console.warn('Could not determine name from filename "' + filename + '" using namePattern, this could be a problem with your configuration.');
								} else {
									destination.__defineGetter__(name, function () {
										return require(filename);
									});
								}
							}
						});
					}
				};
			if (globOptions.sync) {
				files = glob(globPattern, globOptions);
				exposeGetters(null, files);
			} else {
				glob(globPattern, globOptions, function (error, files) {
					exposeGetters(error, files);
					callback(error, destination);
				});
			}
			return destination;
		}
	};
}(require('lodash'), require('path'), require('glob')));
