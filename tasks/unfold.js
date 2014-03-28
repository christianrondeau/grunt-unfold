/*
 * grunt-unfold
 * https://github.com/christian.rondeau/grunt-unfold
 *
 * Copyright (c) 2013 Christian Rondeau
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var that = {};

that.processFile = function(file) {
	
};

that.processFiles = function (files) {
	 _.forEach(files, function(file) {
		 that.processFile(file);
	 });
};

module.exports = that;