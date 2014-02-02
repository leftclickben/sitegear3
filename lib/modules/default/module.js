/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_) {
	"use strict";

	module.exports = function (app) {
		return {
			index: function () {
				return function (request, response, next) {
					var path = request.path.replace(/\/+$/, '') || 'index';
					app.interfaces.storage.get('page', path, function (error, data) {
						if (error) {
							next(error);
						} else {
							response.render('default/index', { fragments: data });
						}
					});
				};
			}
		};
	};
}(require('lodash')));
