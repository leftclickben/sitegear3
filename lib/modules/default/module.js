/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_) {
	"use strict";

	module.exports = function (app) {
		var pageCollection = app.storage.collection('page');

		return {
			index: function () {
				return function (request, response, next) {
					var path = request.path.replace(/\/+$/, '') || 'index';
					pageCollection.get(path, function (error, page) {
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
}(require('lodash')));
