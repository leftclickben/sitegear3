/*jslint node: true, nomen: true, white: true*/
/*!
 * This is the bootstrap script for Sitegear3 integration tests.  It is a variation on the default bootstrap template.
 */

(function (sitegear3, swig) {
	"use strict";

	module.exports = function () {
		// Create the application instance
		var app = sitegear3();

		// Pre-configure
		swig.setDefaults({ cache: false });

		// Generic startup code
		return app.initialise(require('./settings.json'))
			.use(sitegear3.connect.static(__dirname + '/static'))
			.use(sitegear3.middleware.prepareView(app))
			.use(app.router)
			.use(sitegear3.middleware.notFound())
			.use(sitegear3.middleware.internalServerError())
			.persistence('filesystem', { root: __dirname + '/data' })
			.mapRoutes(require('./routes.json'))
			.engine('html', swig.renderFile)
			.set('views', __dirname + '/templates')
			.start(8888);
	};

}(require('../../../index'), require('swig')));
