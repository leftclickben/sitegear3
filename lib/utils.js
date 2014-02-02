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
		 * globGetters(myObject, globPattern, namePattern, function () { ... });
		 * globGetters(globPattern, namePattern, function () { ... });
		 * globGetters(myObject, globPattern, function () { ... });
		 * globGetters(globPattern, function () { ... });
		 *
		 * @param [destination] Object to populate.  If omitted, an empty object will be created.
		 * @param globPattern The glob pattern used to find files to load.
		 * @param [namePattern] The name of the getter is generated using this RegExp on the full file path of each
		 *   matched file.  The name is the first matched capturing group.  Default:
		 *   /\/([a-zA-Z0-9_\-\.]+)\.js$/
		 * @param callback
		 */
		globGetters: function (destination, globPattern, namePattern, callback) {
			switch (arguments.length) {
				case 2:
					callback = globPattern;
					globPattern = destination;
					destination = {};
					namePattern = /\/([a-zA-Z0-9_\-\.]+)\.js$/;
					break;
				case 3:
					if (_.isString(destination)) {
						callback = namePattern;
						namePattern = globPattern;
						globPattern = destination;
						destination = {};
					} else {
						callback = namePattern;
						namePattern = /\/([a-zA-Z0-9_\-\.]+)\.js$/;
					}
					break;
			}
			glob(globPattern, { nonull: false }, function (error, files) {
				if (files && !error) {
					_.each(files, function (filename) {
						if (/\.js/.test(filename)) {
							var matches = namePattern.exec(filename),
								name = matches && matches.length > 1 ? matches[1] : null;
							if (name === null) {
								console.warn('Could not determine name from filename using namePattern, this could be a problem with your configuration.');
							} else {
								destination.__defineGetter__(name, function () {
									return require(filename);
								});
							}
						}
					});
				}
				if (_.isFunction(callback)) {
					callback(error, destination);
				}
			});
		},

		expandSettings: function (originalSettings, settings) {
			// This function is not optimised as it is only called once (plus recursive calls) at application startup.
			if (!settings) {
				settings = originalSettings;
			}
			var regex = /^([\w\W]*?)\{\{\s*([\w\.\-]*)\s*\}\}([\w\W]*?)$/;
			_.each(settings, function (childSettings, childSettingsKey) {
				if (_.isPlainObject(childSettings) || _.isArray(childSettings)) {
					settings[childSettingsKey] = module.exports.expandSettings(originalSettings, childSettings);
				} else if (_.isString(childSettings)) {
					var replacementKey, replacementValue,
						doReplacement = function (replacementKeyComponent) {
							replacementValue = replacementValue && replacementValue.hasOwnProperty(replacementKeyComponent) ? replacementValue[replacementKeyComponent] : null;
						};
					while (regex.test(childSettings)) {
						replacementKey = childSettings.replace(regex, '$2');
						replacementValue = originalSettings;
						_.each(replacementKey.split('.'), doReplacement);
						childSettings = replacementValue ? childSettings.replace(regex, '$1' + replacementValue + '$3') : null;
					}
					settings[childSettingsKey] = childSettings;
				}
			});
			return settings;
		}
	};
}(require('lodash'), require('path'), require('glob')));
