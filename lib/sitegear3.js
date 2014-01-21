/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, fs, connect, express, mergeDescriptors, defaults) {
	"use strict";

	// Expose the application factory method
	module.exports = function () {
		var app = express();
		app._express_init = app.init;
		app.init = function (settings) {
			app._express_init();
			app.settings = _.merge({}, app.settings, defaults, settings);
			return app;
		};
		app.start = function () {
			// TODO Configurable http / https
			app.listen(app.settings.server.port);
			return app;
		};
		return app;
	};

	// Auto-load middleware with getters.
	_.each(fs.readdirSync(path.join(__dirname, 'middleware')), function (filename) {
		if (/\.js$/.test(filename)) {
			var name = path.basename(filename, '.js');
			module.exports.__defineGetter__(name, function () {
				return require('./middleware/' + name);
			});
		}
	});

	// Merge middleware from connect into the exported namespace (this is copied from express.js).
	mergeDescriptors(module.exports, connect.middleware);

}(require('lodash'), require('path'), require('fs'), require('connect'), require('express'), require('merge-descriptors'), require('./defaults.json')));
