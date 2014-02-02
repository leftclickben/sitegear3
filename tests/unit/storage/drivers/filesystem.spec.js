/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, filesystemDriver, os, fs) {
	"use strict";
	require('../../setupTests');

	describe('Storage driver: filesystem', function () {
		it('Exports a function', function () {
			expect(_.isFunction(filesystemDriver)).toBeTruthy();
		});
		describe('When underlying filesystem is working and accessible', function () {
			var filesystem;
			beforeEach(function () {
				filesystem = filesystemDriver({ root: os.tmpdir() });
			});
			describe('The set() method', function () {
				beforeEach(function () {
					spyOn(fs, 'writeFile').andCallFake(function (path, value, options, callback) {
						if (!_.isFunction(callback) && _.isFunction(options)) {
							callback = options;
						}
						callback();
					});
				});
				it('Calls fs.writeFile()', function (done) {
					filesystem.set('type', 'key', { title: 'title', main: 'body content' }, function () {
						expect(fs.writeFile).toHaveBeenCalled();
						expect(fs.writeFile.callCount).toBe(1);
						done();
					});
				});
				it('Calls the callback with correct values', function (done) {
					filesystem.set('type', 'key', { title: 'title', main: 'body content' }, function (error) {
						expect(error).toBeUndefined();
						done();
					});
				});
			});
			describe('The get() method', function () {
				beforeEach(function () {
					spyOn(fs, 'readFile').andCallFake(function (path, options, callback) {
						if (!_.isFunction(callback) && _.isFunction(options)) {
							callback = options;
						}
						callback(undefined, '{ "title": "title", "main": "body content" }');
					});
				});
				it('Calls fs.readFile()', function (done) {
					filesystem.get('type', 'key', function () {
						expect(fs.readFile).toHaveBeenCalled();
						expect(fs.readFile.callCount).toBe(1);
						done();
					});
				});
				it('Calls the callback with correct values', function (done) {
					filesystem.get('type', 'key', function (error, value) {
						expect(error).toBeUndefined();
						expect(_.isPlainObject(value)).toBeTruthy();
						expect(value.title).toBe('title');
						expect(value.main).toBe('body content');
						done();
					});
				});
			});
			describe('The keys() method', function () {
				beforeEach(function () {
					spyOn(fs, 'readdir').andCallFake(function (path, callback) {
						callback(undefined, [ 'foo', 'bar', 'baz' ]);
					});
				});
				it('Calls fs.readdir()', function (done) {
					filesystem.keys('type', function () {
						expect(fs.readdir).toHaveBeenCalled();
						expect(fs.readdir.callCount).toBe(1);
						done();
					});
				});
				it('Calls the callback with correct values', function (done) {
					filesystem.keys('type', function (error, keys) {
						expect(error).toBeUndefined();
						expect(_.isArray(keys)).toBeTruthy();
						expect(keys.length).toBe(3);
						expect(keys[0]).toBe('foo');
						expect(keys[1]).toBe('bar');
						expect(keys[2]).toBe('baz');
						done();
					});
				});
			});
			describe('The all() method', function () {
				beforeEach(function () {
					spyOn(fs, 'readdir').andCallFake(function (path, callback) {
						callback(undefined, [ 'foo.json', 'bar.json', 'baz_xyzzy.json' ]);
					});
					spyOn(fs, 'readFile').andCallFake(function (path, options, callback) {
						callback(undefined, '"this is ' + path + '"');
					});
				});
				it('Calls fs.readdir() and fs.readFile()', function (done) {
					filesystem.all('type', function () {
						expect(fs.readdir).toHaveBeenCalled();
						expect(fs.readdir.callCount).toBe(1);
						expect(fs.readFile).toHaveBeenCalled();
						expect(fs.readFile.callCount).toBe(3);
						done();
					});
				});
				it('Calls the callback with correct values', function (done) {
					filesystem.all('type', function (error, data) {
						expect(error).toBeUndefined();
						expect(_.isPlainObject(data)).toBeTruthy();
						expect(_.size(data)).toBe(3);
						expect(data.foo).toBe('this is /tmp/type/foo.json');
						expect(data.bar).toBe('this is /tmp/type/bar.json');
						expect(data['baz/xyzzy']).toBe('this is /tmp/type/baz_xyzzy.json');
						done();
					});
				});
			});
			describe('The remove() method', function () {
				beforeEach(function () {
					spyOn(fs, 'unlink').andCallFake(function (path, callback) {
						callback(undefined);
					});
				});
				it('Calls fs.unlink()', function (done) {
					filesystem.remove('type', 'key', function () {
						expect(fs.unlink).toHaveBeenCalled();
						expect(fs.unlink.callCount).toBe(1);
						done();
					});
				});
				it('Calls the callback with correct values', function (done) {
					filesystem.remove('type', 'key', function (error) {
						expect(error).toBeUndefined();
						done();
					});
				});
			});
		});
		describe('When underlying filesystem is returning errors', function () {
			var filesystem,
				thrownError = new Error('This is an error');
			beforeEach(function () {
				filesystem = filesystemDriver({ root: os.tmpdir() });
			});
			describe('The set() method', function () {
				beforeEach(function () {
					spyOn(fs, 'writeFile').andCallFake(function (path, value, options, callback) {
						if (!_.isFunction(callback) && _.isFunction(options)) {
							callback = options;
						}
						callback(thrownError);
					});
				});
				it('Calls fs.writeFile()', function (done) {
					filesystem.set('type', 'key', { title: 'title', main: 'body content' }, function () {
						expect(fs.writeFile).toHaveBeenCalled();
						expect(fs.writeFile.callCount).toBe(1);
						done();
					});
				});
				it('Calls the callback with the error', function (done) {
					filesystem.set('type', 'key', { title: 'title', main: 'body content' }, function (error) {
						expect(error).toBe(thrownError);
						done();
					});
				});
			});
			describe('The get() method', function () {
				beforeEach(function () {
					spyOn(fs, 'readFile').andCallFake(function (path, options, callback) {
						if (!_.isFunction(callback) && _.isFunction(options)) {
							callback = options;
						}
						callback(thrownError);
					});
				});
				it('Calls fs.readFile()', function (done) {
					filesystem.get('type', 'key', function () {
						expect(fs.readFile).toHaveBeenCalled();
						expect(fs.readFile.callCount).toBe(1);
						done();
					});
				});
				it('Calls the callback with the error', function (done) {
					filesystem.get('type', 'key', function (error, value) {
						expect(error).toBe(thrownError);
						expect(value).toBeUndefined();
						done();
					});
				});
			});
			describe('The keys() method', function () {
				beforeEach(function () {
					spyOn(fs, 'readdir').andCallFake(function (path, callback) {
						callback(thrownError);
					});
				});
				it('Calls fs.readdir()', function (done) {
					filesystem.keys('type', function () {
						expect(fs.readdir).toHaveBeenCalled();
						expect(fs.readdir.callCount).toBe(1);
						done();
					});
				});
				it('Calls the callback with the error', function (done) {
					filesystem.keys('type', function (error) {
						expect(error).toBe(thrownError);
						done();
					});
				});
			});
			describe('The all() method', function () {
				beforeEach(function () {
					spyOn(fs, 'readdir').andCallFake(function (path, callback) {
						callback(thrownError);
					});
					spyOn(fs, 'readFile').andCallFake(function (path, options, callback) {
						callback(thrownError);
					});
				});
				it('Calls fs.readdir()', function (done) {
					filesystem.all('type', function () {
						expect(fs.readdir).toHaveBeenCalled();
						expect(fs.readdir.callCount).toBe(1);
						expect(fs.readFile).not.toHaveBeenCalled();
						done();
					});
				});
				it('Calls the callback with the error', function (done) {
					filesystem.all('type', function (error) {
						expect(error).toBe(thrownError);
						done();
					});
				});
			});
			describe('The remove() method', function () {
				beforeEach(function () {
					spyOn(fs, 'unlink').andCallFake(function (path, callback) {
						callback(thrownError);
					});
				});
				it('Calls fs.unlink()', function (done) {
					filesystem.remove('type', 'key', function () {
						expect(fs.unlink).toHaveBeenCalled();
						expect(fs.unlink.callCount).toBe(1);
						done();
					});
				});
				it('Calls the callback with the error', function (done) {
					filesystem.remove('type', 'key', function (error) {
						expect(error).toBe(thrownError);
						done();
					});
				});
			});
		});
	});
}(require('lodash'), require('../../../../lib/storage/drivers/filesystem/driver'), require('os'), require('fs')));
