/*!
 * generate-file (https://github.com/generate/generate-file)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('generate-file');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('generate-file')) return;
    debug('initializing "%s", from "%s"', __filename, module.parent.id);

    this.define('file', function() {
      debug('running file');
      
    });
  };
};
