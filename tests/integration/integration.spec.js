/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (siteBootstrap, fs, request) {
	"use strict";

	describe('Sitegear3 integration test', function () {
		var app;
		beforeEach(function () {
			// TODO: execute 'test-site/data/init-redis.js' -- after applying namespaces in redis
			app = siteBootstrap();
		});
		it('Serves the home page', function () {
			request('http://localhost:8888/', function (error, response, body) {
				//expect(body).toBe(fs.readFileSync('./expectations/index.html'));
			});
		});
		afterEach(function () {
			app.dispose();
		})
	});
}(require('./test-site/site'), require('fs'), require('request')));
