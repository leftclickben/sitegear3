/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, connect, express, redis, mergeDescriptors, utils, defaults) {
	"use strict";

	// Expose the application factory method and its "public methods"
	module.exports = function () {
		var app = express();
		app.init();
		return _.extend(app, {
			setup: function (settings) {
				app.settings = _.merge({}, app.settings || {}, defaults, settings);
				app.controllers = utils.loadPathAsGetters(path.join(__dirname, 'controllers'));
				if (app.settings.redis.connect) {
					app.redis = redis.createClient();
					app.redis.on('error', function (err) {
						console.log('Error from redis: ' + err);
					});
				}
				return app;
			},
			mapRoutes: function (routes) {
				_.each(routes, function (route, url) {
					var method = route.method || 'get',
						controller = route.controller || 'default',
						action = route.action || 'index';
					app._router.route(method, url, app.controllers[controller](app)[action]());
				});
				return app;
			},
			start: function () {
				// TODO Configurable http / https
				app.listen(app.settings.server.port);
				console.log('Listening on port ' + app.settings.server.port);
				return app;
			},
			dispose: function () {
				// TODO Stop the http listener
				// TODO Dispose controllers (?)
				if (_.isObject(app.redis) && _.isFunction(app.redis.end)) {
					app.redis.end();
				}
			}
		});
	};

	// Auto-load middleware with getters.
	utils.loadPathAsGetters(module.exports, path.join(__dirname, 'middleware'));

	// Merge middleware from connect into the exported namespace (this is copied from express.js).
	mergeDescriptors(module.exports, connect.middleware);

}(require('lodash'), require('path'), require('connect'), require('express'), require('redis'), require('merge-descriptors'), require('./utils'), require('./defaults.json')));
