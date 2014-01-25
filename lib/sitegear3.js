/*jslint node: true, nomen: true, white: true, unparam: true*/
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
		app._express_init = app.init;
		app.init = function (settings) {
			app._express_init();
			app.settings = _.merge({}, app.settings, defaults, settings);
			app.controllers = utils.loadPathAsGetters(path.join(__dirname, 'controllers'));
			app.redis = redis.createClient();
			app.redis.on('error', function (err) {
				console.log('Error from redis: ' + err);
			});
			return app;
		};
		app.setupRoutes = function () {
			app.get('/', app.controllers.default(app).page());
			app.get('/about', app.controllers.default(app).page());
			app.get('/about/board', app.controllers.default(app).page());
			app.get('/contact', app.controllers.default(app).page());
//			app.post('/contact', app.controllers.forms().form('contact'));
			app.get('/contact/thankyou', app.controllers.default(app).page());
			return app;
		};
		app.start = function () {
			// TODO Configurable http / https
			app.listen(app.settings.server.port);
			return app;
		};
		app.dispose = function () {
			// TODO Stop the http listener
			app.redis.end();
		};
		return app;
	};

	// Auto-load middleware with getters.
	utils.loadPathAsGetters(module.exports, path.join(__dirname, 'middleware'));

	// Merge middleware from connect into the exported namespace (this is copied from express.js).
	mergeDescriptors(module.exports, connect.middleware);

}(require('lodash'), require('path'), require('connect'), require('express'), require('redis'), require('merge-descriptors'), require('./utils'), require('./defaults.json')));
