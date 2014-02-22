/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, http, https, connect, express, templateObject, mediator, utils, defaults) {
	"use strict";

	// Expose the application factory method and its "public methods"
	module.exports = function (settings) {
		var app = express();
		app.init();
		app.settings = templateObject(_.merge({}, app.settings, defaults, settings || {}), 'mustache');
		app.server = {};
		app.components = {};

		return _.extend(app, {
			configureRoutes: function (routes) {
				_.each(routes, function (route) {
					var urlPath = route.path,
						method = route.method || 'get',
						component = app.component(route.component || 'default'),
						actionName = route.action || 'index';
					if (!component.hasOwnProperty(actionName) || !_.isFunction(component[actionName])) {
						throw new Error('Unknown action "' + actionName + '" specified for route at URL "' + urlPath + '"');
					}
					app._router.route(method, urlPath, component[actionName]);
				});
				return app;
			},

			connect: function (adapter) {
				app.data = mediator(adapter);
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

			component: function (name) {
				if (!app.components.hasOwnProperty(name)) {
					var factory = require('sitegear3-component-' + name);
					app.components[name] = factory(app);
				}
				return app.components[name];
			}
		});
	};

	// Expose middleware factories as getters, and expose shortcuts to connect middleware.
	module.exports.middleware = utils.globGetters(path.join(__dirname, 'middleware', '*.js'), { nonull: false, sync: true });
	module.exports.connect = connect.middleware;

}(require('lodash'), require('path'), require('http'), require('https'), require('connect'), require('express'), require('template-object'), require('./mediator'), require('./utils'), require('./defaults.json')));
