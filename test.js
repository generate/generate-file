'use strict';

require('mocha');
var assert = require('assert');
var file = require('./');

describe('generate-file', function() {
  it('should export a function', function() {
    assert.equal(typeof file, 'function');
  });

  it('should export an object', function() {
    assert(file);
    assert.equal(typeof file, 'object');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      file();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      assert.equal(err.message, 'expected callback to be a function');
      cb();
    }
  });
});
