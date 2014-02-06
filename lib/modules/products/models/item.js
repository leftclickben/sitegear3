/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_) {
	"use strict";

	module.exports = {
		getPrice: function (user) {
			return user && user.hasGroup('wholesale') && this.prices.hasOwnProperty('wholesale') ?
				this.prices.wholesale :
				this.prices.retail;
		}
	};
}(require('lodash')));
