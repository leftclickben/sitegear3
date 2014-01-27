/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (utils) {
	"use strict";

	describe('Utility Function: expandSettings()', function () {
		var settings = require('../settings.json');
		beforeEach(function () {
			settings = utils.expandSettings(settings);
		});
		it('Does not affect static keys', function () {
			expect(settings.site.key).toBe('test-spec');
			expect(settings.site.name).toBe('Test Spec');
			expect(settings.site.additionalKey).toBe('value');
			expect(settings.site.parent.child).toBe('childValue');
			expect(settings.foo).toBe('bar');
		});
		it('Expands dynamic keys that refer to a static key', function () {
			expect(settings.expando).toBe('bar');
			expect(settings.expando2).toBe('childValue');
		});
		it('Expands dynamic keys that refer to another dynamic key', function () {
			expect(settings.expando3).toBe('bar');
		});
		it('Expands dynamic keys without affecting static text', function () {
			expect(settings.expando4a).toBe('prefix-bar');
			expect(settings.expando4b).toBe('bar-suffix');
			expect(settings.expando4c).toBe('prefix-bar-suffix');
		});
		it('Replaces unknown keys with null', function () {
			expect(settings.expando5).toBeNull();
		});
	});
}(require('../../../lib/utils')));
