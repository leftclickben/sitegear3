/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (filesystemDriver, os, fs) {
	"use strict";
	require('../../setupTests');

	describe('Storage driver: filesystem', function () {
		var filesystem;
		describe('When underlying filesystem is working and accessible', function () {
			beforeEach(function () {
				filesystem = filesystemDriver({ root: os.tmpdir() });
			});
			describe('The set() method', function () {
				beforeEach(function () {
					spyOn(fs, 'writeFile').andCallFake(function (path, value, callback) {
						callback();
					});
				});
				it('Calls fs.writeFile()', function (done) {
					filesystem.set('type', 'key', 'value', function () {
						expect(fs.writeFile).toHaveBeenCalled();
						expect(fs.writeFile.callCount).toBe(1);
						done();
					});
				});
				it('Calls the callback with correct values', function (done) {
					filesystem.set('type', 'key', 'value', function (error, type, key, value) {
						expect(error).toBeUndefined();
						expect(type).toBe('type');
						expect(key).toBe('key');
						expect(value).toBe('value');
						done();
					});
				});
			});
			describe('The get() method', function () {
				beforeEach(function () {
					spyOn(fs, 'readFile').andCallFake(function (path, callback) {
						callback(undefined, 'value');
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
					filesystem.get('type', 'key', function (error, type, key, value) {
						expect(error).toBeUndefined();
						expect(type).toBe('type');
						expect(key).toBe('key');
						expect(value).toBe('value');
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
					filesystem.remove('type', 'key', function (error, type, key, value) {
						expect(error).toBeUndefined();
						expect(type).toBe('type');
						expect(key).toBe('key');
						expect(value).toBeUndefined();
						done();
					});
				});
			});
		});
		describe('When underlying filesystem is returning errors', function () {
			var thrownError = new Error('This is an error');
			beforeEach(function () {
				filesystem = filesystemDriver({ root: os.tmpdir() });
			});
			describe('The set() method', function () {
				beforeEach(function () {
					spyOn(fs, 'writeFile').andCallFake(function (path, value, callback) {
						callback(thrownError);
					});
				});
				it('Calls fs.writeFile()', function (done) {
					filesystem.set('type', 'key', 'value', function () {
						expect(fs.writeFile).toHaveBeenCalled();
						expect(fs.writeFile.callCount).toBe(1);
						done();
					});
				});
				it('Calls the callback with correct values', function (done) {
					filesystem.set('type', 'key', 'value', function (error, type, key, value) {
						expect(error).toBe(thrownError);
						expect(type).toBe('type');
						expect(key).toBe('key');
						expect(value).toBe('value');
						done();
					});
				});
			});
			describe('The get() method', function () {
				beforeEach(function () {
					spyOn(fs, 'readFile').andCallFake(function (path, callback) {
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
				it('Calls the callback with correct values', function (done) {
					filesystem.get('type', 'key', function (error, type, key, value) {
						expect(error).toBe(thrownError);
						expect(type).toBe('type');
						expect(key).toBe('key');
						expect(value).toBeUndefined();
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
				it('Calls the callback with correct values', function (done) {
					filesystem.remove('type', 'key', function (error, type, key, value) {
						expect(error).toBe(thrownError);
						expect(type).toBe('type');
						expect(key).toBe('key');
						expect(value).toBeUndefined();
						done();
					});
				});
			});
		});
	});
}(require('../../../../lib/storage/drivers/filesystem'), require('os'), require('fs')));
