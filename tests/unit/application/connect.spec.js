/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, jasmine) {
	"use strict";
	require('../setupTests');

	describe('Application lifecycle: connect()', function () {
		describe('When called with a valid connector', function () {
			var app, connectorSpy;
			beforeEach(function () {
				connectorSpy = jasmine.createSpy('connector');
				app = sitegear3(require('../settings.json'));
				spyOn(app, 'connector').andReturn(connectorSpy);
				app.connect('test', { foo: 'foo', bar: 'baz' });
			});
			it('Instantiates the data provider', function () {
				expect(app.data).not.toBeUndefined();
			});
			it('Invokes the connector() method', function () {
				expect(app.connector).toHaveBeenCalledWith('test');
				expect(app.connector.callCount).toBe(1);
			});
			describe('When creating a repository', function () {
				beforeEach(function () {
					app.data.define('test-repository');
				});
				it('Instantiates the specified connectors', function () {
					expect(connectorSpy).toHaveBeenCalledWith({ foo: 'foo', bar: 'baz' });
					expect(connectorSpy.callCount).toBe(1);
				});
			});
		});
		describe('When called with an unknown connector', function () {
			var app, error;
			beforeEach(function () {
				app = sitegear3(require('../settings.json'));
				try {
					app.connect('unknown');
				} catch (e) {
					error = e;
				}
			});
			it('Does not instantiate the data provider', function () {
				expect(app.data).toBeUndefined();
			});
			it('Throws the relevant exception', function () {
				expect(error).not.toBeUndefined();
				expect(error.message).toBe("Cannot find module '/home/ben/workspace-node/sitegear3/lib/data/connectors/unknown'");
			});
		});
		describe('When called with an invalid connector', function () {
			var app, error;
			beforeEach(function () {
				app = sitegear3(require('../settings.json'));
				spyOn(app, 'connector').andReturn('this should be a function, not a string');
				try {
					app.connect('test');
				} catch (e) {
					error = e;
				}
			});
			it('Does not instantiate the data interface', function () {
				expect(app.data).toBeUndefined();
			});
			it('Throws the relevant exception', function () {
				expect(error).not.toBeUndefined();
				expect(error.message).toBe('Invalid data connector specified: test');
			});
		});
	});
}(require('lodash'), require('../../../index'), require('jasmine-node')));
