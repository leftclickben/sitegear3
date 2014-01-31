/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, connect, express, redis, mergeDescriptors, storage, utils, defaults) {
	"use strict";

	// Expose the application factory method and its "public methods"
	module.exports = function () {
		var app = express();
		return _.extend(app, {
			initialise: function (settings) {
				app.init();
				app.settings = utils.expandSettings(_.merge({}, app.settings, defaults, settings || {}));
				app.controllers = utils.loadPathAsGetters(path.join(__dirname, 'controllers'));
				app.storage = storage(app);
				return app;
			},
			mapRoutes: function (routes) {
				var controllers = {};
				_.each(routes, function (route, url) {
					var method = route.method || 'get',
						controller = route.controller || 'default',
						action = route.action || 'index';
					if (!app.controllers.hasOwnProperty(controller) || !_.isFunction(app.controllers[controller])) {
						throw new Error('Unknown controller "' + controller + '" specified for route at URL "' + url + '"');
					}
					if (!controllers.hasOwnProperty(controller)) {
						controllers[controller] = app.controllers[controller](app);
					}
					if (!controllers[controller].hasOwnProperty(action) || !_.isFunction(controllers[controller][action])) {
						throw new Error('Unknown action "' + action + '" specified for route at URL "' + url + '"');
					}
					app._router.route(method, url, controllers[controller][action]());
				});
				return app;
			},
			persistence: function () {
				// TODO Remove this and replace with high-level interface, which uses adapters to connect to back-ends
				app.redis = redis.createClient();
				app.redis.on('error', function (err) {
					console.log('Error from redis: ' + err);
				});
				return app;
			},
			start: function () {
				// TODO Configurable http / https
				var httpPort = app.get('http port');
				app.listen(httpPort);
				console.log('Listening on port ' + httpPort);
				return app;
			},
			stop: function () {
				// TODO Stop the http listener
				// TODO Dispose controllers (?)
				if (_.isObject(app.redis) && _.isFunction(app.redis.end)) {
					app.redis.end();
				}
			}
		});
	};

	// Auto-load middleware with getters.
	utils.loadPathAsGetters(module.exports, path.join(__dirname, 'helpers'));

	// Merge middleware from connect into the exported namespace (this is copied from express.js).
	mergeDescriptors(module.exports, connect.middleware);

}(require('lodash'), require('path'), require('connect'), require('express'), require('redis'), require('merge-descriptors'), require('./storage/interface'), require('./utils'), require('./defaults.json')));
