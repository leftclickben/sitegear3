/*jslint node: true, nomen: true, white: true, unparam: true*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function () {
	"use strict";
	module.exports = function (grunt) {
		grunt.loadNpmTasks('grunt-jasmine-node');
		grunt.loadNpmTasks('grunt-jslint');
		grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			jslint: {
				root: {
					src: [
						'index.js',
						'Gruntfile.js'
					],
					options: {
						log: 'build/log/jslint/jslint.root.log'
					}
				},
				lib: {
					src: [
						'lib/**/*.js'
					],
					options: {
						log: 'build/log/jslint/jslint.src.log'
					}
				},
				tests: {
					src: [
						'tests/**/*.js'
					],
					options: {
						log: 'build/log/jslint/jslint.tests.log'
					}
				}
			},
			jasmine_node: {
				projectRoot: '.',
				jUnit: {
					report: true,
					savePath: 'build/log/jasmine/'
				},
				forceExit: false
			}
		});
		grunt.registerTask('qa', ['jasmine_node', 'jslint']);
		grunt.registerTask('default', ['qa']);
	};
}());
