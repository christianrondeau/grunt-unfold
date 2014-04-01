/*
 * grunt-unfold
 * https://github.com/christian.rondeau/grunt-unfold
 *
 * Copyright (c) 2013 Christian Rondeau
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var path = require('path');

var expressions = {
	whitespace: /[\t ]*/,
	tagBegin: /<!--[ \t]*unfold:\w+ .*(?=-->)[ \t]*-->/,
	tagContent: /[\s\S]*?/,
	tagEnd: /<!--[ \t]*\/unfold[ \t]*-->/
};

expressions.section = new RegExp(expressions.whitespace.source + expressions.tagBegin.source + expressions.tagContent.source + expressions.tagEnd.source, 'g');

module.exports = function (grunt, options) {
	var that = {};

	function getTypeFromTagBegin(tagBegin) {
		var indexOfType = tagBegin.indexOf('unfold:') + 7;
		var type = tagBegin.substring(indexOfType, tagBegin.indexOf(' ', indexOfType));

		if (type === 'unfold') {
			throw new Error('"unfold" cannot be a type');
		}

		return type;
	}

	function detectLineBreakString(section, whitespace, tagBegin) {
		var lineBreak = section.substr(whitespace.length + tagBegin.length, 2);
		return lineBreak === '\r\n' ? lineBreak : '\n';
	}

	function getTypeDefinition(type) {
		var typeDefinition = options.types[type];
		if (!typeDefinition) {
			throw new Error('No type defined for "' + type + '"');
		}
		if (!typeDefinition.template) {
			throw new Error('No template defined for type "' + type + '"');
		}
		return typeDefinition;
	}

	function getPathFilterFromTagBegin(tagBegin, type) {
		return tagBegin.substring(tagBegin.indexOf(type) + type.length, tagBegin.indexOf('-->')).trim();
	}

	function buildLinesListFromGlobbingPattern(dir, pathFilter, typeDefinition) {
		var lines = [];

		grunt.file.expand({
			cwd: dir
		}, pathFilter).forEach(function (path) {
			lines.push(typeDefinition.template.replace('$PATH$', path));
		});
		return lines;
	}

	that.processSection = function (dir, section) {
		var indentation = section.match(/^[\t ]*/)[0];
		var tagBegin = section.match(expressions.tagBegin)[0];
		var tagEnd = section.match(expressions.tagEnd)[0];
		var lineBreak = detectLineBreakString(section, indentation, tagBegin);
		var type = getTypeFromTagBegin(tagBegin);
		var typeDefinition = getTypeDefinition(type);
		var pathFilter = getPathFilterFromTagBegin(tagBegin, type);

		var lines = [];
		lines.push(tagBegin);
		lines = lines.concat(buildLinesListFromGlobbingPattern(dir, pathFilter, typeDefinition));
		lines.push(tagEnd);

		return _.map(lines, function (line) {
			return indentation + line;
		}).join(lineBreak);
	};

	that.processContent = function (dir, content) {
		return content.replace(expressions.section, function (section) {
			return that.processSection(dir, section);
		});
	};

	that.processFile = function (src, dest) {
		var content = grunt.file.read(src);

		var dir = src.substring(0, src.lastIndexOf('/'));

		var result = that.processContent(dir, content);

		if (content !== result || src !== dest) {
			grunt.file.write(dest, result);
			grunt.log.writeln(' Written into "' + dest + '"');
		} else {
			grunt.log.writeln(' Not written (no changes)');
		}
	};

	that.processFiles = function (files) {
		_.forEach(files, function (file) {
			_.forEach(file.src, function (src) {
				if (!grunt.file.exists(src)) {
					grunt.log.warn('File "' + src + '" not found.');
				} else {
					grunt.log.write('Processing "' + src + '"... ');
					
					var dest = file.dest;
					if (!file.dest) {
						dest = src;
					} else if (grunt.file.isDir(dest)) {
						dest = path.join(dest, src);
					}
					
					that.processFile(src, dest);
				}
			});
		});
	};

	return that;
};