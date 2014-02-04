/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, jasmine, path, fs, schemaValidator) {
	"use strict";
	require('../../setupTests');

	describe('Validator: schemaValidator', function () {
		var inputRoot = path.join(__dirname, '_input');
		it('Exports a function', function () {
			expect(_.isFunction(schemaValidator)).toBeTruthy();
		});
		it('Returns a function', function () {
			var validator = schemaValidator();
			expect(_.isFunction(validator)).toBeTruthy();
		});
		_.each([ 'example1' ], function (group) {
			var groupRoot = path.join(inputRoot, group),
				schemaFile = path.join(groupRoot,  group + '.schema.json');
			describe('When invoked with schema definition "' + group + '"', function () {
				var validator;
				beforeEach(function () {
					validator = schemaValidator(require(schemaFile));
				});
				describe('When invoked on valid data', function () {
					var validRoot, validFilenames;
					beforeEach(function (done) {
						validRoot = path.join(groupRoot, 'valid-data');
						fs.readdir(validRoot, function (error, valid) {
							validFilenames = valid;
							done();
						});
					});
					_.each(validFilenames, function (filename) {
						if (/\.json$/.test(filename)) {
							describe('Filename "' + filename + '"', function () {
								var callbackSpy;
								beforeEach(function (done) {
									callbackSpy = jasmine.createSpy('callback spy');
									validator(require(path.join(validRoot, filename)), function (errors) {
										callbackSpy(errors);
										done();
									});
								});
								it('Calls the callback without errors [' + filename + ']', function () {
									expect(callbackSpy).toHaveBeenCalledWith(undefined);
									expect(callbackSpy.callCount).toBe(1);
								});
							});
						}
					});
				});
				describe('When invoked on invalid data', function () {
					var invalidRoot, invalidFilenames;
					beforeEach(function (done) {
						invalidRoot = path.join(groupRoot, 'invalid-data');
						fs.readdir(invalidRoot, function (error, invalid) {
							invalidFilenames = invalid;
							done();
						});
					});
					_.each(invalidFilenames, function (filename) {
						if (/\.json$/.test(filename)) {
							describe('Filename "' + filename + '"', function () {
								var callbackSpy;
								beforeEach(function (done) {
									callbackSpy = jasmine.createSpy('callback spy');
									validator(require(path.join(invalidRoot, filename)), function (errors) {
										callbackSpy(errors);
										done();
									});
								});
								it('Calls the callback with an error [' + filename + ']', function () {
									expect(callbackSpy).toHaveBeenCalled();
									expect(callbackSpy.callCount).toBe(1);
									expect(callbackSpy.mostRecentCall.args.length).toBe(1);
									expect(callbackSpy.mostRecentCall.args[0] instanceof Error).toBeTruthy();
								});
							});
						}
					});
				});
			});
		});
	});
}(require('lodash'), require('jasmine-node'), require('path'), require('fs'), require('../../../../lib/validators/schema')));
