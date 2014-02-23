/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, path, fs, http, https, connect, express, templateObject, mediator, prepareView, notFound, internalServerError, defaults) {
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

			start: function (port, callback) {
				if (!_.isNumber(port)) {
					callback = port;
					port = 80;
				}
				callback = callback || _.noop;
				process.nextTick(function () {
					app.server.http = http.createServer(app).listen(port, function () {
						console.log('Listening on port ' + port);
						callback();
					});
				});
				return app;
			},

			startSecure: function (options, port, callback) {
				if (!_.isNumber(port)) {
					callback = port;
					port = 443;
				}
				callback = callback || _.noop;
				if (_.isString(options)) {
					fs.readFile(options, function (error, data) {
						app.startSecure({ pfx: data }, port, callback);
					});
				} else {
					process.nextTick(function () {
						app.server.https = https.createServer(options, app).listen(port, function () {
							console.log('Listening with SSL on port ' + port);
							callback();
						});
					});
				}
				return app;
			},

			stop: function (callback) {
				var next = function () {
					if (_.isPlainObject(app.server) && _.size(app.server) > 0) {
						var key = _.keys(app.server)[0];
						console.log('Closing ' + key + ' port');
						app.server[key].close(function () {
							delete app.server[key];
							next();
						});
					} else {
						delete app.server;
						process.nextTick(callback);
					}
				};
				next();
				return app;
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
}(require('lodash'), require('path'), require('fs'), require('http'), require('https'), require('connect'), require('express'), require('template-object'), require('./mediator'), require('./middleware/prepareView'), require('./middleware/notFound'), require('./middleware/internalServerError'), require('./defaults.json')));
