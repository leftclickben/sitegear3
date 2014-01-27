/*jslint node: true, nomen: true, white: true*/
/*!
 * Initialise the redis data store for the Sitegear3 demo site.
 */

(function (sitegear3) {
	"use strict";

	// Create and initialise the application instance
	var app = sitegear3().initialise(require('../settings.json')).persistence();

	// Use the application's connection to redis to populate the data store
	app.redis.set('page./.title', 'Index');
	app.redis.set('page./.main', 'This is the main fragment of the index page.');

	// Finish up cleanly so we don't hang the process
	app.dispose();

}(require('sitegear3')));
