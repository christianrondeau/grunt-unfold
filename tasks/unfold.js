/*
 * grunt-unfold
 * https://github.com/christian.rondeau/grunt-unfold
 *
 * Copyright (c) 2013 Christian Rondeau
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');

var expressions = {
	whitespace: /[\t ]*/,
	tagBegin: /<!--[ \t]*unfold:js .*(?=-->)[ \t]*-->/,
	tagContent: /[\s\S]*/,
	tagEnd: /<!--[ \t]*\/unfold[ \t]*-->/
};

expressions.section = new RegExp(expressions.whitespace.source + expressions.tagBegin.source + expressions.tagContent.source + expressions.tagEnd.source, 'g');

module.exports = function (grunt, options) {
	var that = {};

	that.processSection = function (section) {
		var whitespace = section.match(/^[\t ]*/)[0];
		var tagBegin = section.match(expressions.tagBegin)[0];
		var tagEnd = section.match(expressions.tagEnd)[0];
		var lineBreak = section.substr(whitespace.length + tagBegin.length, 2);
		if (lineBreak !== '\r\n') {
			lineBreak = '\n';
		}

		var pathFilter = tagBegin.substring(tagBegin.indexOf('unfold:js') + 9, tagBegin.indexOf('-->')).trim();
		
		var lines = [tagBegin];
		grunt.file.expand({
			cwd: options.root
		}, pathFilter).forEach(function (path) {
			//TODO: Provide a template dictionary (one for js, one for css etc.)
			lines.push(options.types['js'].template.replace('$PATH$', path));
		});
		lines.push(tagEnd);

		return _.map(lines, function (line) {
			return whitespace + line;
		}).join(lineBreak);
	};

	that.processContent = function (content) {
		return content.replace(expressions.section, function (section) {
			return that.processSection(section);
		});
	};

	that.processFile = function (src) {
		var content = grunt.file.read(src);
		var result = that.processContent(content);
		if (content !== result) {
			grunt.file.write(src, result);
		}
	};

	that.processFiles = function (files) {
		_.forEach(files, function (file) {
			_.forEach(file.src, function (src) {
				if (!grunt.file.exists(src)) {
					grunt.log.warn('File "' + src + '" not found.');
				} else {
					grunt.log.writeln('Processing "' + src + '"');
					that.processFile(src);
				}
			});
		});
	};

	return that;
};