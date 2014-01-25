/*jslint node: true, nomen: true, white: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_) {
	"use strict";

	module.exports = function (date, format) {
		if (!date || !_.isFunction(date.toISOString)) {
			return '';
		}
		switch ((format || 'locale').toLowerCase()) {
			case 'locale':
				return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
			case 'iso':
				return date.toISOString();
			case 'javascript':
				return date.toString();
			default:
				return '';
		}
	};
}(require('lodash')));
