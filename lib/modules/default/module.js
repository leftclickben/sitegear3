/*jslint node: true, nomen: true, white: true, unparam: true, todo: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, schemaValidator) {
	"use strict";

	module.exports = function (app) {
		var pageRepository = app.data.define('page', schemaValidator(require('./schema/page.schema.json'))).on('error', function (error) {
				console.log('Page repository encountered an error: ' + error); // TODO Something better
			});

		return {
			index: function () {
				return function (request, response, next) {
					var path = request.path.replace(/\/+$/, '') || 'index';
					pageRepository.get(path, function (error, page) {
						if (error) {
							next(error);
						} else if (!_.isUndefined(page) && !_.isNull(page)) {
							response.render('default/index', { fragments: page });
						} else {
							next();
						}
					});
				};
			}
		};
	};
}(require('lodash'), require('../../data/validators/schema')));
