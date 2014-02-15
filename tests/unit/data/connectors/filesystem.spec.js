/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, filesystemConnector, os, fs) {
	"use strict";
	require('../../setupTests');

	describe('Data connector: filesystem', function () {
		it('Exports a function', function () {
			expect(_.isFunction(filesystemConnector)).toBeTruthy();
		});
		describe('When underlying filesystem is working and accessible', function () {
			var filesystem;
			beforeEach(function () {
				filesystem = filesystemConnector({ root: os.tmpdir() });
			});
			describe('The set() method', function () {
				var error;
				beforeEach(function (done) {
					spyOn(fs, 'writeFile').andCallFake(function (path, value, options, callback) {
						if (!_.isFunction(callback) && _.isFunction(options)) {
							callback = options;
						}
						callback();
					});
					filesystem.set('type', 'key', { title: 'title', main: 'body content' }, function (e) {
						error = e;
						done();
					});
				});
				it('Calls fs.writeFile()', function () {
					expect(fs.writeFile).toHaveBeenCalled();
					expect(fs.writeFile.callCount).toBe(1);
				});
				it('Calls the callback with correct values', function () {
					expect(error).toBeUndefined();
				});
			});
			describe('The get() method', function () {
				var error, value;
				beforeEach(function (done) {
					spyOn(fs, 'readFile').andCallFake(function (path, options, callback) {
						if (!_.isFunction(callback) && _.isFunction(options)) {
							callback = options;
						}
						callback(undefined, '{ "title": "title", "main": "body content" }');
					});
					filesystem.get('type', 'key', function (e, v) {
						error = e;
						value = v;
						done();
					});
				});
				it('Calls fs.readFile()', function () {
					expect(fs.readFile).toHaveBeenCalled();
					expect(fs.readFile.callCount).toBe(1);
				});
				it('Calls the callback with correct values', function () {
					expect(error).toBeUndefined();
					expect(_.isPlainObject(value)).toBeTruthy();
					expect(value.title).toBe('title');
					expect(value.main).toBe('body content');
				});
			});
			describe('The keys() method', function () {
				var error, keys;
				beforeEach(function (done) {
					spyOn(fs, 'readdir').andCallFake(function (path, callback) {
						callback(undefined, [ 'foo', 'bar', 'baz' ]);
					});
					filesystem.keys('type', function (e, k) {
						error = e;
						keys = k;
						done();
					});
				});
				it('Calls fs.readdir()', function () {
					expect(fs.readdir).toHaveBeenCalled();
					expect(fs.readdir.callCount).toBe(1);
				});
				it('Calls the callback with correct values', function () {
					expect(error).toBeUndefined();
					expect(_.isArray(keys)).toBeTruthy();
					expect(keys.length).toBe(3);
					expect(keys[0]).toBe('foo');
					expect(keys[1]).toBe('bar');
					expect(keys[2]).toBe('baz');
				});
			});
			describe('The all() method', function () {
				var error, data;
				beforeEach(function (done) {
					spyOn(fs, 'readdir').andCallFake(function (path, callback) {
						callback(undefined, [ 'foo.json', 'bar.json', 'baz_xyzzy.json' ]);
					});
					spyOn(fs, 'readFile').andCallFake(function (path, options, callback) {
						callback(undefined, '"this is ' + path + '"');
					});
					filesystem.all('type', function (e, d) {
						error = e;
						data = d;
						done();
					});
				});
				it('Calls fs.readdir() and fs.readFile()', function () {
					expect(fs.readdir).toHaveBeenCalled();
					expect(fs.readdir.callCount).toBe(1);
					expect(fs.readFile).toHaveBeenCalled();
					expect(fs.readFile.callCount).toBe(3);
				});
				it('Calls the callback with correct values', function () {
					expect(error).toBeUndefined();
					expect(_.isPlainObject(data)).toBeTruthy();
					expect(_.size(data)).toBe(3);
					expect(data.foo).toBe('this is /tmp/type/foo.json');
					expect(data.bar).toBe('this is /tmp/type/bar.json');
					expect(data['baz/xyzzy']).toBe('this is /tmp/type/baz_xyzzy.json');
				});
			});
			describe('The remove() method', function () {
				var error;
				beforeEach(function (done) {
					spyOn(fs, 'unlink').andCallFake(function (path, callback) {
						callback(undefined);
					});
					filesystem.remove('type', 'key', function (e) {
						error = e;
						done();
					});
				});
				it('Calls fs.unlink()', function () {
					expect(fs.unlink).toHaveBeenCalled();
					expect(fs.unlink.callCount).toBe(1);
				});
				it('Calls the callback with correct values', function () {
					expect(error).toBeUndefined();
				});
			});
		});
		describe('When underlying filesystem is returning errors', function () {
			var filesystem,
				thrownError = new Error('This is an error');
			beforeEach(function () {
				filesystem = filesystemConnector({ root: os.tmpdir() });
			});
			describe('The set() method', function () {
				var error;
				beforeEach(function (done) {
					spyOn(fs, 'writeFile').andCallFake(function (path, value, options, callback) {
						if (!_.isFunction(callback) && _.isFunction(options)) {
							callback = options;
						}
						callback(thrownError);
					});
					filesystem.set('type', 'key', { title: 'title', main: 'body content' }, function (e) {
						error = e;
						done();
					});
				});
				it('Calls fs.writeFile()', function () {
					expect(fs.writeFile).toHaveBeenCalled();
					expect(fs.writeFile.callCount).toBe(1);
				});
				it('Calls the callback with the error', function () {
					expect(error).toBe(thrownError);
				});
			});
			describe('The get() method', function () {
				var error, value;
				beforeEach(function (done) {
					spyOn(fs, 'readFile').andCallFake(function (path, options, callback) {
						if (!_.isFunction(callback) && _.isFunction(options)) {
							callback = options;
						}
						callback(thrownError);
					});
					filesystem.get('type', 'key', function (e, v) {
						error = e;
						value = v;
						done();
					});
				});
				it('Calls fs.readFile()', function () {
					expect(fs.readFile).toHaveBeenCalled();
					expect(fs.readFile.callCount).toBe(1);
				});
				it('Calls the callback with the error', function () {
					expect(error).toBe(thrownError);
					expect(value).toBeUndefined();
				});
			});
			describe('The keys() method', function () {
				var error;
				beforeEach(function (done) {
					spyOn(fs, 'readdir').andCallFake(function (path, callback) {
						callback(thrownError);
					});
					filesystem.keys('type', function (e) {
						error = e;
						done();
					});
				});
				it('Calls fs.readdir()', function () {
					expect(fs.readdir).toHaveBeenCalled();
					expect(fs.readdir.callCount).toBe(1);
				});
				it('Calls the callback with the error', function () {
					expect(error).toBe(thrownError);
				});
			});
			describe('The all() method', function () {
				var error;
				beforeEach(function (done) {
					spyOn(fs, 'readdir').andCallFake(function (path, callback) {
						callback(thrownError);
					});
					spyOn(fs, 'readFile').andCallFake(function (path, options, callback) {
						callback(thrownError);
					});
					filesystem.all('type', function (e) {
						error = e;
						done();
					});
				});
				it('Calls fs.readdir()', function () {
					expect(fs.readdir).toHaveBeenCalled();
					expect(fs.readdir.callCount).toBe(1);
					expect(fs.readFile).not.toHaveBeenCalled();
				});
				it('Calls the callback with the error', function () {
					expect(error).toBe(thrownError);
				});
			});
			describe('The remove() method', function () {
				var error;
				beforeEach(function (done) {
					spyOn(fs, 'unlink').andCallFake(function (path, callback) {
						callback(thrownError);
					});
					filesystem.remove('type', 'key', function (e) {
						error = e;
						done();
					});
				});
				it('Calls fs.unlink()', function () {
					expect(fs.unlink).toHaveBeenCalled();
					expect(fs.unlink.callCount).toBe(1);
				});
				it('Calls the callback with the error', function () {
					expect(error).toBe(thrownError);
				});
			});
		});
	});
}(require('lodash'), require('../../../../lib/data/connectors/filesystem/connector'), require('os'), require('graceful-fs')));
