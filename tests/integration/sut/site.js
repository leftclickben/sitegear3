/*jslint node: true, nomen: true, white: true*/
/*!
 * This is the bootstrap script for Sitegear3 integration tests.  It is a variation on the default bootstrap template.
 */

(function (sitegear3, connect, swig, filesystemAdapter) {
	"use strict";

	module.exports = function () {
		// Create the application instance
		var app = sitegear3(require('./settings.json'));

		// Pre-configure
		swig.setDefaults({ cache: false });

		// Generic startup code
		return app
			.use(connect.static(__dirname + '/static'))
			.connect(filesystemAdapter({ root: __dirname + '/data' }))
			.routing(require('./routes.json'))
			.engine('html', swig.renderFile)
			.set('views', __dirname + '/templates')
			.start(8888);
	};
}(require('../../../'), require('connect'), require('swig'), require('sitegear3-adapter-filesystem')));
