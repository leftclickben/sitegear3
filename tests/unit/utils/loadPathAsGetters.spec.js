/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, utils, path) {
	"use strict";
	require('../setupTests');

	describe('Utility Function: loadPathAsGetters()', function () {
		describe('Uses __defineGetter__()', function () {
			var object;
			beforeEach(function () {
				object = {};
				spyOn(object, '__defineGetter__').andCallThrough();
			});
			it('Uses __defineGetter__() to define getters', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function () {
					expect(object.__defineGetter__).toHaveBeenCalled();
					expect(object.__defineGetter__.callCount).toBe(2);
					done();
				});
			});
		});
		describe('Creates an empty object by default', function () {
			it('Loads all .js files in specified directory and unpacks them as getters', function (done) {
				utils.loadPathAsGetters(path.join(__dirname, '_getters', '*.js'), function (error, returnedObject) {
					expect(returnedObject.a).toBeTruthy();
					expect(_.isFunction(returnedObject.a)).toBeTruthy();
					expect(returnedObject.b).toBeTruthy();
					expect(_.isFunction(returnedObject.b)).toBeTruthy();
					done();
				});
			});
			it('Doesn\'t define properties based on non-js files', function (done) {
				utils.loadPathAsGetters(path.join(__dirname, '_getters', '*.js'), function (error, returnedObject) {
					expect(returnedObject.x).toBeUndefined();
					done();
				});
			});
			it('Doesn\'t define any additional properties', function (done) {
				utils.loadPathAsGetters(path.join(__dirname, '_getters', '*.js'), function (error, returnedObject) {
					expect(_.size(returnedObject)).toBe(2);
					done();
				});
			});
			it('Defines getters that work as expected', function (done) {
				utils.loadPathAsGetters(path.join(__dirname, '_getters', '*.js'), function (error, returnedObject) {
					var a = returnedObject.a(),
						b = returnedObject.b();
					expect(_.isFunction(a)).toBeTruthy();
					expect(a()).toBe('This is "a"');
					expect(_.isFunction(b)).toBeTruthy();
					expect(b('a parameter')).toBe('This is "b", parameter is "a parameter"');
					expect(b('another parameter')).toBe('This is "b", parameter is "another parameter"');
					done();
				});
			});
		});
		describe('Extends an empty object and returns it', function () {
			var object;
			beforeEach(function () {
				object = {};
			});
			it('Returns the passed-in object', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function (error, returnedObject) {
					expect(returnedObject).toBe(object);
					done();
				});
			});
			it('Loads all .js files in specified directory and unpacks them as getters', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function () {
					expect(object.a).toBeTruthy();
					expect(_.isFunction(object.a)).toBeTruthy();
					expect(object.b).toBeTruthy();
					expect(_.isFunction(object.b)).toBeTruthy();
					done();
				});
			});
			it('Doesn\'t define properties based on non-js files', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function () {
					expect(object.x).toBeUndefined();
					done();
				});
			});
			it('Doesn\'t define any additional properties', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function () {
					expect(_.size(object)).toBe(2);
					done();
				});
			});
			it('Defines getters that work as expected', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function () {
					var a = object.a(),
						a2 = object.a(),
						b = object.b();
					expect(_.isFunction(a)).toBeTruthy();
					expect(a2).not.toBe(a);
					expect(a()).toBe('This is "a"');
					expect(_.isFunction(b)).toBeTruthy();
					expect(b('a parameter')).toBe('This is "b", parameter is "a parameter"');
					expect(b('another parameter')).toBe('This is "b", parameter is "another parameter"');
					done();
				});
			});
		});
		describe('Extends an existing object and returns it', function () {
			var object;
			beforeEach(function () {
				object = {
					a: function () {
						return 'This is pre-existing "a"';
					},
					y: function () {
						return 'This is pre-existing "y"';
					},
					z: 'A string'
				};
			});
			it('Returns the passed-in object', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function (error, returnedObject) {
					expect(returnedObject).toBe(object);
					done();
				});
			});
			it('Overrides existing properties with a new getter', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function () {
					expect(object.a).toBeTruthy();
					expect(_.isFunction(object.a)).toBeTruthy();
					var a = object.a();
					expect(_.isFunction(a)).toBeTruthy();
					expect(a()).toBe('This is "a"');
					done();
				});
			});
			it('Extends the object with new getters', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function () {
					expect(object.b).toBeTruthy();
					expect(_.isFunction(object.b)).toBeTruthy();
					var b = object.b();
					expect(_.isFunction(b)).toBeTruthy();
					expect(b('a parameter')).toBe('This is "b", parameter is "a parameter"');
					expect(b('another parameter')).toBe('This is "b", parameter is "another parameter"');
					done();
				});
			});
			it('Doesn\'t define properties based on non-js files', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function () {
					expect(object.x).toBeUndefined();
					done();
				});
			});
			it('Doesn\'t define any additional properties', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function () {
					expect(_.size(object)).toBe(4); // 2 existing not overridden, 1 existing overridden, 1 new
					done();
				});
			});
			it('Doesn\'t affect other pre-existing properties', function (done) {
				utils.loadPathAsGetters(object, path.join(__dirname, '_getters', '*.js'), function () {
					expect(object.y()).toBe('This is pre-existing "y"');
					expect(object.z).toBe('A string');
					done();
				});
			});
		});
	});
}(require('lodash'), require('../../../lib/utils'), require('path')));
