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
				return function (request, response) {
					var settings = app.settings.controllers.default.page,
						path = request.path.replace(/\/+$/, '') || '/',
						baseKey = settings.prefix + settings.separator + path + settings.separator,
						fragments = {};
					_.each(settings.blocks, function (key) {
						app.redis.get(baseKey + key, function (error, data) {
							fragments[key] = data || '';
							if (_.size(fragments) >= settings.blocks.length) {
								response.render('page', { fragments: fragments });
							}
						});
					});
				}
			}
		}
	};
}(require('lodash')));
