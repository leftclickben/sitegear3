/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, fs) {
	"use strict";

	module.exports = {
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
		}
	};
}(require('lodash'), require('path'), require('fs')));
