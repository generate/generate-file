'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('base-fs-conflicts', 'conflicts');
require('extend-shallow', 'extend');
require('isobject', 'isObject');
require('is-valid-app', 'isValid');
require('dashify', 'dashify');
require('verb-defaults', 'defaults');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
