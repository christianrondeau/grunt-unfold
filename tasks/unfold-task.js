/*
 * grunt-unfold
 * https://github.com/christian.rondeau/grunt-unfold
 *
 * Copyright (c) 2013 Christian Rondeau
 * Licensed under the MIT license.
 */

'use strict';
var unfold = require('./unfold');

module.exports = function(grunt) {

	grunt.registerMultiTask('unfold', 'Inserts script tags based on a folder path or file pattern', function() {

		var options = this.options({
			types: {
				'js': {
					template: '<script src="$PATH$"></script>'
				},
				'css': {
					template: '<link rel="stylesheet" href="$PATH$" />'
				},
				'img': {
					template: '<img src="$PATH$" />'
				}
			}
		});
		
		unfold(grunt, options).processFiles(this.files);

	});

};
