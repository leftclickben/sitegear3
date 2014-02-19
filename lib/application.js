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
		app.domains = {};

		return _.extend(app, {
			configureRoutes: function (routes) {
				_.each(routes, function (route) {
					var urlPath = route.path,
						method = route.method || 'get',
						domain = app.domain(route.domain || 'default'),
						actionName = route.action || 'index';
					if (!domain.hasOwnProperty(actionName) || !_.isFunction(domain[actionName])) {
						throw new Error('Unknown action "' + actionName + '" specified for route at URL "' + urlPath + '"');
					}
					app._router.route(method, urlPath, domain[actionName]);
				});
				return app;
			},

			connect: function (connector) {
				app.data = dataProvider(connector);
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

			domain: function (name) {
				if (!app.domains.hasOwnProperty(name)) {
					var domainFactory = require(path.join(__dirname, 'domains', name));
					app.domains[name] = domainFactory(app);
				}
				return app.domains[name];
			}
		});
	};

	// Expose middleware factories and connector factories as getters, and expose shortcuts to connect middleware.
	module.exports.middleware = utils.globGetters(path.join(__dirname, 'middleware', '*.js'), { nonull: false, sync: true });
	module.exports.connect = connect.middleware;

}(require('lodash'), require('path'), require('http'), require('https'), require('connect'), require('express'), require('./data/provider'), require('./utils'), require('./defaults.json')));
