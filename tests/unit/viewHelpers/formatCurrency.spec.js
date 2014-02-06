/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, formatCurrency) {
	"use strict";
	require('../setupTests');

	describe('View Helper: formatCurrency', function () {
		it('Exports a function', function () {
			expect(_.isFunction(formatCurrency)).toBeTruthy();
		});
		it('Formats numeric inputs correctly', function () {
			expect(formatCurrency(-101)).toBe('-$1.01');
			expect(formatCurrency(-100)).toBe('-$1.00');
			expect(formatCurrency(-99)).toBe('-$0.99');
			expect(formatCurrency(-1)).toBe('-$0.01');
			expect(formatCurrency(0)).toBe('$0.00');
			expect(formatCurrency(1)).toBe('$0.01');
			expect(formatCurrency(99)).toBe('$0.99');
			expect(formatCurrency(100)).toBe('$1.00');
			expect(formatCurrency(101)).toBe('$1.01');
		});
		it('Returns an empty string for non-numeric inputs', function () {
			expect(formatCurrency('a string')).toBe('');
			expect(formatCurrency({ 'an': 'object' })).toBe('');
			expect(formatCurrency([ 'an', 'array' ])).toBe('');
			expect(formatCurrency(true)).toBe('');
			expect(formatCurrency(null)).toBe('');
		});
	});
}(require('lodash'), require('../../../lib/viewHelpers/formatCurrency')));
