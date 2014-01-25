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
			page: function () {
				return function (request, response) {
					var prefix = 'page', // TODO Get from settings (?)
						separator = '.', // TODO Get from settings (?)
						baseKey = prefix + separator + request.path.replace(/\/+$/, '') + separator,
						keys = [ 'main', 'title' ], // TODO Get from settings (?)
						fragments = {};
					_.each(keys, function (key) {
						app.redis.get(baseKey + key, function (error, data) {
							fragments[key] = data;
							if (_.size(fragments) >= keys.length) {
								response.render('index', { fragments: fragments });
							}
						});
					});
				}
			}
		}
	};
}(require('lodash')));
