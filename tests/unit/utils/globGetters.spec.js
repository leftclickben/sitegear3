/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, utils, path) {
	"use strict";
	require('../../setupTests');

	describe('Utility Function: globGetters()', function () {
		describe('Uses __defineGetter__()', function () {
			var object;
			beforeEach(function (done) {
				object = {};
				spyOn(object, '__defineGetter__').andCallThrough();
				utils.globGetters(object, path.join(__dirname, '..', '_input', 'getters', '*.js'), {}, function () {
					done();
				});
			});
			it('Uses __defineGetter__() to define getters', function () {
				expect(object.__defineGetter__).toHaveBeenCalled();
				expect(object.__defineGetter__.callCount).toBe(2);
			});
		});
		describe('Creates an empty object by default', function () {
			var error, returnedObject;
			beforeEach(function (done) {
				utils.globGetters(path.join(__dirname, '..', '_input', 'getters', '*.js'), {}, function (e, r) {
					error = e;
					returnedObject = r;
					done();
				});
			});
			it('Does not return an error', function () {
				expect(error).toBeFalsy();
			});
			it('Loads all .js files in specified directory and unpacks them as getters', function () {
				expect(returnedObject.a).toBeTruthy();
				expect(_.isFunction(returnedObject.a)).toBeTruthy();
				expect(returnedObject.b).toBeTruthy();
				expect(_.isFunction(returnedObject.b)).toBeTruthy();
			});
			it('Doesn\'t define properties based on non-js files', function () {
				expect(returnedObject.x).toBeUndefined();
			});
			it('Doesn\'t define any additional properties', function () {
				expect(_.size(returnedObject)).toBe(2);
			});
			it('Defines getters that work as expected', function () {
				var a = returnedObject.a(),
					b = returnedObject.b();
				expect(_.isFunction(a)).toBeTruthy();
				expect(a()).toBe('This is "a"');
				expect(_.isFunction(b)).toBeTruthy();
				expect(b('a parameter')).toBe('This is "b", parameter is "a parameter"');
				expect(b('another parameter')).toBe('This is "b", parameter is "another parameter"');
			});
		});
		describe('Extends an empty object and returns it', function () {
			var object, error, returnedObject;
			beforeEach(function (done) {
				object = {};
				utils.globGetters(object, path.join(__dirname, '..', '_input', 'getters', '*.js'), {}, function (e, r) {
					error = e;
					returnedObject = r;
					done();
				});
			});
			it('Does not return an error', function () {
				expect(error).toBeFalsy();
			});
			it('Returns the passed-in object', function () {
				expect(returnedObject).toBe(object);
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
					a2 = object.a(),
					b = object.b();
				expect(_.isFunction(a)).toBeTruthy();
				expect(a2).not.toBe(a);
				expect(a()).toBe('This is "a"');
				expect(_.isFunction(b)).toBeTruthy();
				expect(b('a parameter')).toBe('This is "b", parameter is "a parameter"');
				expect(b('another parameter')).toBe('This is "b", parameter is "another parameter"');
			});
		});
		describe('Extends an existing object and returns it', function () {
			var object, error, returnedObject;
			beforeEach(function (done) {
				object = {
					a: function () {
						return 'This is pre-existing "a"';
					},
					y: function () {
						return 'This is pre-existing "y"';
					},
					z: 'A string'
				};
				utils.globGetters(object, path.join(__dirname, '..', '_input', 'getters', '*.js'), {}, function (e, r) {
					error = e;
					returnedObject = r;
					done();
				});
			});
			it('Does not return an error', function () {
				expect(error).toBeFalsy();
			});
			it('Returns the passed-in object', function () {
				expect(returnedObject).toBe(object);
			});
			it('Overrides existing properties with a new getter', function () {
				expect(object.a).toBeTruthy();
				expect(_.isFunction(object.a)).toBeTruthy();
				var a = object.a();
				expect(_.isFunction(a)).toBeTruthy();
				expect(a()).toBe('This is "a"');
			});
			it('Extends the object with new getters', function () {
				expect(object.b).toBeTruthy();
				expect(_.isFunction(object.b)).toBeTruthy();
				var b = object.b();
				expect(_.isFunction(b)).toBeTruthy();
				expect(b('a parameter')).toBe('This is "b", parameter is "a parameter"');
				expect(b('another parameter')).toBe('This is "b", parameter is "another parameter"');
			});
			it('Doesn\'t define properties based on non-js files', function () {
				expect(object.x).toBeUndefined();
			});
			it('Doesn\'t define any additional properties', function () {
				expect(_.size(object)).toBe(4); // 2 existing not overridden, 1 existing overridden, 1 new
			});
			it('Doesn\'t affect other pre-existing properties', function () {
				expect(object.y()).toBe('This is pre-existing "y"');
				expect(object.z).toBe('A string');
			});
		});
		describe('Matches deep glob patterns', function () {
			var error, returnedObject;
			beforeEach(function (done) {
				utils.globGetters(/\/([a-zA-Z0-9_\-\.]+)\/getter\.js/, path.join(__dirname, '..', '_input', 'gettersNested', '**', '*.js'), {}, function (e, r) {
					error = e;
					returnedObject = r;
					done();
				});
			});
			it('Does not return an error', function () {
				expect(error).toBeFalsy();
			});
			it('Loads all .js files in specified directory and unpacks them as getters', function () {
				expect(returnedObject.m).toBeTruthy();
				expect(_.isFunction(returnedObject.m)).toBeTruthy();
				expect(returnedObject.n).toBeTruthy();
				expect(_.isFunction(returnedObject.n)).toBeTruthy();
			});
			it('Doesn\'t define properties based on non-js files', function () {
				expect(returnedObject.x).toBeUndefined();
			});
			it('Doesn\'t define any additional properties', function () {
				expect(_.size(returnedObject)).toBe(2);
			});
			it('Defines getters that work as expected', function () {
				var m = returnedObject.m(),
					n = returnedObject.n();
				expect(_.isFunction(m)).toBeTruthy();
				expect(m()).toBe('This is "m"');
				expect(_.isFunction(n)).toBeTruthy();
				expect(n('a parameter')).toBe('This is "n", parameter is "a parameter"');
				expect(n('another parameter')).toBe('This is "n", parameter is "another parameter"');
			});
		});
	});
}(require('lodash'), require('../../../lib/utils'), require('path')));
