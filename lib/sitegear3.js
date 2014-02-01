/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, http, https, connect, express, redis, mergeDescriptors, storage, utils, defaults) {
	"use strict";

	// Expose the application factory method and its "public methods"
	module.exports = function () {
		var app = express();
		return _.extend(app, {
			initialise: function (settings) {
				app.init();
				app.settings = utils.expandSettings(_.merge({}, app.settings, defaults, settings || {}));
				app.modules = utils.loadPathAsGetters(path.join(__dirname, 'modules'));
				app.storageDrivers = utils.loadPathAsGetters(path.join(__dirname, 'storage', 'drivers'));
				app.interfaces = {};
				app.server = {};
				return app;
			},
			mapRoutes: function (routes) {
				var modules = {};
				_.each(routes, function (route, url) {
					var method = route.method || 'get',
						module = route.module || 'default',
						action = route.action || 'index';
					if (!app.modules.hasOwnProperty(module) || !_.isFunction(app.modules[module])) {
						throw new Error('Unknown module "' + module + '" specified for route at URL "' + url + '"');
					}
					if (!modules.hasOwnProperty(module)) {
						modules[module] = app.modules[module](app);
					}
					if (!modules[module].hasOwnProperty(action) || !_.isFunction(modules[module][action])) {
						throw new Error('Unknown action "' + action + '" specified for route at URL "' + url + '"');
					}
					app._router.route(method, url, modules[module][action]());
				});
				return app;
			},
			persistence: function (driverName, driverOptions) {
				var driver = app.storageDrivers[driverName];
				if (_.isUndefined(driver)) {
					throw new Error('Unknown storage driver specified: ' + driverName);
				}
				if (!_.isFunction(driver)) {
					throw new Error('Invalid storage driver specified: ' + driverName);
				}
				app.interfaces.storage = storage(driver(driverOptions));
				app.interfaces.storage.on('error', _.noop); // TODO Either don't emit these events, or do something with them.
				return app;
			},
			start: function (httpPort, httpsOptions, httpsPort) {
				if (_.isObject(httpPort)) {
					httpsPort = httpsOptions;
					httpsOptions = httpPort;
				}
				if (_.isUndefined(httpPort)) {
					httpPort = 80;
				}
				if (_.isNumber(httpPort)) {
					app.server.http = http.createServer(app).listen(httpPort, function () {
						console.log('Listening on port ' + httpPort);
					});
				}
				if (_.isObject(httpsOptions)) {
					if (_.isUndefined(httpsPort)) {
						httpsPort = 443;
					}
					if (_.isNumber(httpsPort)) {
						app.server.https = https.createServer(httpsOptions, app).listen(httpsPort, function () {
							console.log('Listening with SSL on port ' + httpsPort);
						});
					}
				}
				return app;
			},
			stop: function () {
				// TODO Dispose modules (?)
				if (_.isObject(app.server)) {
					_.each(app.server, function (server, key) {
						console.log('Closing ' + key + ' port');
						server.close();
//						app.server[key] = null; // TODO This breaks tests which check that it was closed, fix this
					});
				}
			}
		});
	};

	// Auto-load middleware with getters.
	utils.loadPathAsGetters(module.exports, path.join(__dirname, 'helpers'));

	// Merge middleware from connect into the exported namespace (this is copied from express.js).
	mergeDescriptors(module.exports, connect.middleware);

}(require('lodash'), require('path'), require('http'), require('https'), require('connect'), require('express'), require('redis'), require('merge-descriptors'), require('./storage/interface'), require('./utils'), require('./defaults.json')));
