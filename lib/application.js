/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, http, https, connect, express, dataProvider, utils, defaults) {
	"use strict";

	// Expose the application factory method and its "public methods"
	module.exports = function (settings) {
		var app = express();
		app.init();
		app.settings = utils.expandSettings(_.merge({}, app.settings, defaults, settings || {}));
		app.server = {};
		app.modules = {};

		return _.extend(app, {
			configureRoutes: function (routes) {
				_.each(routes, function (route) {
					var urlPath = route.path,
						method = route.method || 'get',
						appModule = app.module(route.module || 'default'),
						actionName = route.action || 'index';
					if (!appModule.hasOwnProperty(actionName) || !_.isFunction(appModule[actionName])) {
						throw new Error('Unknown action "' + actionName + '" specified for route at URL "' + urlPath + '"');
					}
					app._router.route(method, urlPath, appModule[actionName]);
				});
				return app;
			},

			connect: function (connectorName, connectorOptions) {
				var connector = app.connector(connectorName);
				if (!_.isFunction(connector)) {
					throw new Error('Invalid data connector specified: ' + connectorName);
				}
				app.data = dataProvider(connector(connectorOptions));
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
				if (_.isObject(app.server)) {
					_.each(app.server, function (server, key) {
						console.log('Closing ' + key + ' port');
						server.close();
					});
				}
			},

			module: function (name) {
				if (!app.modules.hasOwnProperty(name)) {
					var moduleFactory = require(path.join(__dirname, 'modules', name));
					app.modules[name] = moduleFactory(app);
				}
				return app.modules[name];
			},

			connector: function (name) {
				return require(path.join(__dirname, 'data', 'connectors', name));
			}
		});
	};

	// Expose middleware factories and connector factories as getters, and expose shortcuts to connect middleware.
	module.exports.middleware = utils.globGetters(path.join(__dirname, 'middleware', '*.js'), { nonull: false, sync: true });
	module.exports.connect = connect.middleware;

}(require('lodash'), require('path'), require('http'), require('https'), require('connect'), require('express'), require('./data/provider'), require('./utils'), require('./defaults.json')));
