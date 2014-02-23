/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, formatDate) {
	"use strict";
	require('../../setupTests');

	describe('viewHelpers/formatDate.js', function () {
		var date = new Date();
		it('exports a function', function () {
			expect(_.isFunction(formatDate)).toBeTruthy();
		});
		it('returns an empty string for non-Date inputs', function () {
			expect(formatDate()).toBe('');
			expect(formatDate(null)).toBe('');
			expect(formatDate('')).toBe('');
			expect(formatDate('string value')).toBe('');
			expect(formatDate('2014-01-26')).toBe('');
			expect(formatDate(1234567)).toBe('');
			expect(formatDate({ an: 'object' })).toBe('');
			expect(formatDate([ 'an', 'array' ])).toBe('');
		});
		it('returns a locale formatted string when type is not specified', function () {
			expect(formatDate(date)).toBe(date.toLocaleDateString() + ' ' + date.toLocaleTimeString());
		});
		it('returns a locale formatted string when type is "locale"', function () {
			expect(formatDate(date, 'locale')).toBe(date.toLocaleDateString() + ' ' + date.toLocaleTimeString());
			expect(formatDate(date, 'Locale')).toBe(date.toLocaleDateString() + ' ' + date.toLocaleTimeString());
		});
		it('returns a ISO formatted string when type is "iso"', function () {
			expect(formatDate(date, 'iso')).toBe(date.toISOString());
			expect(formatDate(date, 'ISO')).toBe(date.toISOString());
		});
		it('returns a formatted string when type is "javascript"', function () {
			expect(formatDate(date, 'javascript')).toBe(date.toString());
			expect(formatDate(date, 'JavaScript')).toBe(date.toString());
		});
		it('returns an empty string for unknown type parameter values', function () {
			expect(formatDate(date, 'invalid')).toBe('');
		});
	});
}(require('lodash'), require('../../../lib/viewHelpers/formatDate')));
