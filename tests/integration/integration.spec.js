/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (sitegear3, siteBootstrap, fs, request) {
	"use strict";
	require('../setupTests');

	describe('Sitegear3 integration test', function () {
		var app,
			readFileOptions = { encoding: 'utf8' };
		beforeEach(function () {
			app = siteBootstrap();
		});
		it('Serves the home page', function (done) {
			fs.readFile(__dirname + '/expectations/index.txt', readFileOptions, function (readFileError, expectedData) {
				request('http://localhost:8888/', function (requestError, response, data) {
					expect(response.statusCode).toBe(200);
					expect(data).toBe(expectedData);
					done();
				});
			});
		});
		it('Serves a test page at the top level', function (done) {
			fs.readFile(__dirname + '/expectations/test.txt', readFileOptions, function (readFileError, expectedData) {
				request('http://localhost:8888/test', function (requestError, response, data) {
					expect(response.statusCode).toBe(200);
					expect(data).toBe(expectedData);
					done();
				});
			});
		});
		it('Serves a test page at the second level', function (done) {
			fs.readFile(__dirname + '/expectations/nested_test.txt', readFileOptions, function (readFileError, expectedData) {
				request('http://localhost:8888/nested/test', function (requestError, response, data) {
					expect(response.statusCode).toBe(200);
					expect(data).toBe(expectedData);
					done();
				});
			});
		});
		it('Serves a test page at the third level', function (done) {
			fs.readFile(__dirname + '/expectations/third_level_page.txt', readFileOptions, function (readFileError, expectedData) {
				request('http://localhost:8888/third/level/page', function (requestError, response, data) {
					expect(response.statusCode).toBe(200);
					expect(data).toBe(expectedData);
					done();
				});
			});
		});
		it('Serves a static URL', function (done) {
			fs.readFile(__dirname + '/sut/static/resource.txt', readFileOptions, function (readFileError, expectedData) {
				request('http://localhost:8888/resource.txt', function (requestError, response, data) {
					expect(response.statusCode).toBe(200);
					expect(data).toBe(expectedData);
					done();
				});
			});
		});
		it('Serves a 404 page for unknown URLs', function (done) {
			fs.readFile(__dirname + '/expectations/not_found.txt', readFileOptions, function (readFileError, expectedData) {
				request('http://localhost:8888/not/found', function (requestError, response, data) {
					expect(response.statusCode).toBe(404);
					expect(data).toBe(expectedData);
					done();
				});
			});
		});
		it('Serves a 500 page when invalid syntax encountered in data file', function (done) {
			fs.readFile(__dirname + '/expectations/internal_server_error.txt', readFileOptions, function (readFileError, expectedData) {
				request('http://localhost:8888/bad/data', function (requestError, response, data) {
					expect(response.statusCode).toBe(500);
					expect(data).toBe(expectedData);
					done();
				});
			});
		});
		afterEach(function (done) {
			app.stop(done);
		});
	});
}(require('../../index'), require('./sut/site'), require('graceful-fs'), require('request')));
