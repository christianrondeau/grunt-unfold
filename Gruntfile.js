/*
 * grunt-unfold
 * https://github.com/christian.rondeau/grunt-unfold
 *
 * Copyright (c) 2013 Christian Rondeau
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
	'use strict';

	grunt.loadTasks('tasks');
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			tasks: [
				'Gruntfile.js',
				'tasks/**/*.js'
			],
			tests: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/spec/*.js']
			}
		},

		unfold: {
			files: ['test/fixtures/sample.html']
		},

		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					clearRequireCache: true,
					growl: true
				},
				src: ['test/spec/*-spec.js']
			}
		},

		watch: {
			test: {
				options: {
					//atBegin: true,
					spawn: false,
				},
				files: '**/*.js',
				tasks: ['mochaTest']
			}
		}

	});

	grunt.registerTask('test', [
		'jshint',
		'unfold',
		'mochaTest'
	]);

	grunt.registerTask('default', [
		'test'
	]);

};