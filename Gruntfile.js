/*
 * grunt-unfold
 * https://github.com/christian.rondeau/grunt-unfold
 *
 * Copyright (c) 2013 Christian Rondeau
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

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
		
		clean: ['test/current'],
		
		copy: {
			testFixtures: {
				expand: true,
				cwd: 'test/fixtures',
				src: '**/*.*',
				dest: 'test/current',
			}
		},

		unfold: {
			overwriteSelf: {
				src: 'test/current/**/*.html'
			},
			writeAnotherFolder: {
				expand: true,
				cwd: 'test/current',
				src: 'sample.html',
				dest: 'test/current/dist/'
			},
			writeAnotherFile: {
				src: 'test/current/sample.html',
				dest: 'test/current/sample-dist.html'
			}
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
	
	grunt.registerTask('test-real', [
		'clean',
		'copy',
		'unfold:writeAnotherFile',
		'unfold:writeAnotherFolder',
		'unfold:overwriteSelf'
	]);

	grunt.registerTask('test', [
		'jshint',
		'mochaTest',
		'test-real'
	]);
	
	grunt.registerTask('travis', [
		'test'
	]);

	grunt.registerTask('default', [
		'test'
	]);

};