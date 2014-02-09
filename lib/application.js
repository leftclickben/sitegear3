/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, http, https, connect, express, dataProvider, utils, defaults) {
	"use strict";

	// Expose the application factory method and its "public methods"
	module.exports = function () {
		var app = express();
		return _.extend(app, {
			initialise: function (settings) {
				app.init();
				app.settings = utils.expandSettings(_.merge({}, app.settings, defaults, settings || {}));
				app.server = {};
				return app;
			},

			mapRoutes: function (routes) {
				var moduleGetters = module.exports.modules,
					modules = {};
				_.each(routes, function (route) {
					var urlPath = route.path,
						method = route.method || 'get',
						module = route.module || 'default',
						action = route.action || 'index';
					if (!moduleGetters.hasOwnProperty(module) || !_.isFunction(moduleGetters[module])) {
						throw new Error('Unknown module "' + module + '" specified for route at URL "' + urlPath + '"');
					}
					if (!modules.hasOwnProperty(module)) {
						modules[module] = moduleGetters[module](app);
					}
					if (!modules[module].hasOwnProperty(action) || !_.isFunction(modules[module][action])) {
						throw new Error('Unknown action "' + action + '" specified for route at URL "' + urlPath + '"');
					}
					app._router.route(method, urlPath, modules[module][action]());
				});
				return app;
			},

			persistence: function (connectorName, connectorOptions) {
				var connector = module.exports.connectors[connectorName];
				if (_.isUndefined(connector)) {
					throw new Error('Unknown data connector specified: ' + connectorName);
				}
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
			}
		});
	};

	// Expose middleware factories as getters.
	utils.globGetters(path.join(__dirname, 'middleware', '*.js'), function (error, result) {
		module.exports.middleware = result;
	});

	// Expose module factories as getters.
	utils.globGetters(path.join(__dirname, 'modules', '**', 'module.js'), /\/([a-zA-Z0-9_\-\.]+)\/module\.js$/, function (error, result) {
		module.exports.modules = result;
	});

	// Expose connector factories as getters.
	utils.globGetters(path.join(__dirname, 'data', 'connectors', '**', 'connector.js'), /\/([a-zA-Z0-9_\-\.]+)\/connector\.js$/, function (error, result) {
		module.exports.connectors = result;
	});

	// Expose shortcuts to connect middleware.
	module.exports.connect = connect.middleware;

	module.exports.ready = function (timeout, callback) {
		var interval,
			started = Date.now();
		if (!callback) {
			callback = timeout;
			timeout = 5000;
		}
		interval = setInterval(function () {
			var readyStatus = {
				middleware: _.isObject(module.exports.middleware),
				modules: _.isObject(module.exports.modules),
				connectors: _.isObject(module.exports.connectors)
			};
			if (readyStatus.middleware && readyStatus.modules && readyStatus.connectors) {
				clearInterval(interval);
				callback();
			} else if (Date.now() > started + timeout) {
				clearInterval(interval);
				callback(new Error('Timed out waiting for all resources to be ready after ' + timeout + 'ms.  Current status is: ' + JSON.stringify(readyStatus)));
			}
		}, 100);
	};

}(require('lodash'), require('path'), require('http'), require('https'), require('connect'), require('express'), require('./data/provider'), require('./utils'), require('./defaults.json')));
