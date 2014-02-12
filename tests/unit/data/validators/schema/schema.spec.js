/*jslint node: true, nomen: true, white: true, unparam: true, plusplus: true, stupid: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, jasmine, path, fs, schemaValidator) {
	"use strict";
	require('../../../setupTests');

	describe('Validator: schemaValidator', function () {
		it('Exports a function', function () {
			expect(_.isFunction(schemaValidator)).toBeTruthy();
		});
		it('Returns a function when invoked', function () {
			expect(_.isFunction(schemaValidator())).toBeTruthy();
		});
		describe('When invoked with various schema and data', function () {
			var inputRoot = path.join(__dirname, '_input'),
				errorMessageRegex = /Received \d+ errors? from JSON schema validator: \[\[ [a-z0-9"',.\/\-_\+<>\$\s]* \]\](?:; \[\[ [a-z0-9"',.\/\-_\+<>\$] \]\])*/i;
			_.each(fs.readdirSync(inputRoot), function (dirname) {
				var callbackSpy, validator,
					schemaFilename = path.join(inputRoot, dirname, dirname + '.schema.json'),
					validDataRoot = path.join(inputRoot, dirname, 'valid-data'),
					invalidDataRoot = path.join(inputRoot, dirname, 'invalid-data');
				beforeEach(function () {
					validator = schemaValidator(require(schemaFilename));
				});
				describe('When data set "' + dirname + '" is invoked with valid data', function () {
					_.each(fs.readdirSync(validDataRoot), function (filename) {
						describe('When invoked with "' + filename + '"', function () {
							beforeEach(function (done) {
								callbackSpy = jasmine.createSpy().andCallFake(function () {
									done();
								});
								validator(require(path.join(validDataRoot, filename)), callbackSpy);
							});
							it('Calls the callback without any errors', function () {
								expect(callbackSpy).toHaveBeenCalledWith();
								expect(callbackSpy.callCount).toBe(1);
							});
						});
					});
				});
				describe('When data set "' + dirname + '" is invoked with invalid data', function () {
					_.each(fs.readdirSync(invalidDataRoot), function (filename) {
						describe('When invoked with "' + filename + '"', function () {
							beforeEach(function (done) {
								callbackSpy = jasmine.createSpy().andCallFake(function () {
									done();
								});
								validator(require(path.join(invalidDataRoot, filename)), callbackSpy);
							});
							it('Calls the callback with error', function () {
								expect(callbackSpy).toHaveBeenCalled();
								expect(callbackSpy.callCount).toBe(1);
								expect(callbackSpy.mostRecentCall.args.length).toBe(1);
								expect(callbackSpy.mostRecentCall.args[0] instanceof Error).toBeTruthy();
								expect(errorMessageRegex.test(callbackSpy.mostRecentCall.args[0].message)).toBeTruthy();
							});
						});
					});
				});
			});
		});
	});
}(require('lodash'), require('jasmine-node'), require('path'), require('graceful-fs'), require('../../../../../lib/data/validators/schema')));
