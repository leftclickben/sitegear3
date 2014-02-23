/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, http, https, connect, express, templateObject, mediator, prepareView, notFound, internalServerError, defaults) {
	"use strict";

	// Expose the application factory method and its "public methods"
	module.exports = function (settings) {
		var app = express();
		app.init();
		app.settings = templateObject(_.merge({}, app.settings, defaults, settings || {}), 'mustache');
		app.server = {};
		app.components = {};

		return _.extend(app, {
			routing: function (routes) {
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
				// TODO Allow these to be overridden
				return app
					.use(prepareView(app))
					.use(app.router)
					.use(notFound())
					.use(internalServerError());
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
}(require('lodash'), require('path'), require('http'), require('https'), require('connect'), require('express'), require('template-object'), require('./mediator'), require('./middleware/prepareView'), require('./middleware/notFound'), require('./middleware/internalServerError'), require('./defaults.json')));
