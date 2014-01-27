/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, utils, path) {
	"use strict";

	describe('Utility Function: loadPathAsGetters()', function () {
		var object;
		describe('Uses __defineGetter__()', function () {
			beforeEach(function () {
				object = {};
				spyOn(object, '__defineGetter__').andCallThrough();
				utils.loadPathAsGetters(object, path.join(__dirname, 'getters'));
			});
			it('Uses __defineGetter__() to define getters', function () {
				expect(object.__defineGetter__).toHaveBeenCalled();
				expect(object.__defineGetter__.callCount).toBe(2);
			});
		});
		describe('Defines the correct getters', function () {
			beforeEach(function () {
				object = {};
				utils.loadPathAsGetters(object, path.join(__dirname, 'getters'));
			});
			it('Loads all .js files in specified directory and unpacks them as getters', function () {
				expect(object.a).toBeTruthy();
				expect(_.isFunction(object.a)).toBeTruthy();
				expect(object.b).toBeTruthy();
				expect(_.isFunction(object.b)).toBeTruthy();
			});
			it('Doesn\'t define properties based on non-js files', function () {
				expect(object.x).toBeUndefined();
			});
			it('Doesn\'t define any additional properties', function () {
				expect(_.size(object)).toBe(2);
			});
			it('Defines getters that work as expected', function () {
				var a = object.a(),
					b = object.b();
				expect(_.isFunction(a)).toBeTruthy();
				expect(a()).toBe('This is "a"');
				expect(_.isFunction(b)).toBeTruthy();
				expect(b('a parameter')).toBe('This is "b", parameter is "a parameter"');
				expect(b('another parameter')).toBe('This is "b", parameter is "another parameter"');
			});
		});
	});
}(require('lodash'), require('../../../lib/utils'), require('path')));
