/*jslint node: true, nomen: true, white: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_) {
	"use strict";

	module.exports = function (value) {
		if (!_.isNumber(value)) {
			return '';
		}
		return (value < 0 ? '-' : '') + '$' + (Math.abs(value) / 100).toFixed(2);
	};
}(require('lodash')));
