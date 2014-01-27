/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function () {
	"use strict";
	module.exports = function (grunt) {

		grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			jasmine_node: {
				projectRoot: '.'
			}
		});

		grunt.loadNpmTasks('grunt-jasmine-node');

		grunt.registerTask('default', ['jasmine_node'])

	};
}());
