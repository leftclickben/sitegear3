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
					response.render('products/index');
				}
			},
			details: function (productSlug) {
				return function (request, response) {
					response.render('products/details');
				}
			}
		}
	};
}(require('lodash')));
