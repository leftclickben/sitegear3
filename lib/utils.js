/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, fs) {
	"use strict";

	var utils = module.exports = {
		loadPathAsGetters: function (object, scanPath) {
			if (!scanPath) {
				scanPath = object;
				object = {};
			}
			_.each(fs.readdirSync(scanPath), function (filename) {
				if (/\.js/.test(filename)) {
					var name = path.basename(filename, '.js');
					object.__defineGetter__(name, function () {
						return require(path.join(scanPath, name));
					});
				}
			});
			return object;
		},

		expandSettings: function (originalSettings, settings) {
			// This function is not optimised as it is only called once (plus recursive calls) at application startup.
			if (!settings) {
				settings = originalSettings;
			}
			var regex = /^(.*?)\{\{\s*([\w\.\-]*)\s*\}\}(.*?)$/;
			_.each(settings, function (childSettings, childSettingsKey) {
				if (_.isPlainObject(childSettings) || _.isArray(childSettings)) {
					settings[childSettingsKey] = utils.expandSettings(originalSettings, childSettings);
				} else if (_.isString(childSettings)) {
					while (regex.test(childSettings)) {
						var replacementKey = childSettings.replace(regex, '$2'),
							replacementValue = originalSettings;
						_.each(replacementKey.split('.'), function (replacementKeyComponent) {
							replacementValue = replacementValue && replacementValue.hasOwnProperty(replacementKeyComponent) ? replacementValue[replacementKeyComponent] : null;
						});
						childSettings = replacementValue ? childSettings.replace(regex, '$1' + replacementValue + '$3') : null;
					}
					settings[childSettingsKey] = childSettings;
				}
			});
			return settings;
		}
	};
}(require('lodash'), require('path'), require('fs')));
