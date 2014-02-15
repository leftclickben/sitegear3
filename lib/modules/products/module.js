/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, schemaValidator) {
	"use strict";

	module.exports = function (app) {
		var moduleInstance = {
			index: function (request, response, next) {
				moduleInstance.categoryRepository.all(function (error, categories) {
					if (error) {
						next(error);
					} else if (!_.isUndefined(categories) && !_.isNull(categories)) {
						response.render('products/index', { categories: categories });
					} else {
						next();
					}
				});
			},

			category: function (request, response, next) {
				var slug = request.params.category;
				moduleInstance.categoryRepository.get(slug, function (error, category) {
					if (error) {
						next(error);
					} else if (!_.isUndefined(category) && !_.isNull(category)) {
						response.render('products/category', { slug: slug, category: category });
					} else {
						next();
					}
				});
			},

			item: function (request, response, next) {
				var slug = request.params.item;
				moduleInstance.itemRepository.get(slug, function (error, item) {
					if (error) {
						next(error);
					} else if (!_.isUndefined(item) && !_.isNull(item)) {
						response.render('products/item', { slug: slug, item: item });
					} else {
						next();
					}
				});
			}
		};

		moduleInstance.categoryRepository = app.data.define('productCategory', schemaValidator(require('./schema/category.schema.json'))).on('error', function (error) {
			console.log('Product category repository encountered an error: ' + error);
		});
		moduleInstance.itemRepository = app.data.define('productItem', require('./models/item'), schemaValidator(require('./schema/item.schema.json'))).on('error', function (error) {
			console.log('Product item repository encountered an error: ' + error);
		});

		return moduleInstance;
	};
}(require('lodash'), require('../../data/validators/schema')));
