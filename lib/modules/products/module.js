/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_) {
	"use strict";

	module.exports = function (app) {
		var categoryCollection = app.interfaces.storage.collection('productCategory'),
			itemCollection = app.interfaces.storage.collection('productItem');

		return {
			index: function () {
				return function (request, response) {
					response.render('products/index');
				};
			},
			category: function() {
				return function (request, response, next) {
					var slug = request.params.category;
					categoryCollection.get(slug, function (error, category) {
						if (error) {
							next(error);
						} else if (category) {
							response.render('products/category', { slug: slug, category: category });
						} else {
							next();
						}
					});
				};
			},
			item: function () {
				return function (request, response, next) {
					var slug = request.params.item;
					itemCollection.get(slug, function (error, item) {
						if (error) {
							next(error);
						} else if (item) {
							response.render('products/item', { slug: slug, item: item });
						} else {
							next();
						}
					});
				};
			}
		};
	};
}(require('lodash')));
