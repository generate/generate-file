'use strict';

process.env.GENERATE_CLI = true;

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var generate = require('generate');
var existsSync = require('fs-exists-sync');
var del = require('delete');
var generator = require('./');
var app;

function exists(name, cb) {
  var filepath = path.resolve(__dirname, 'actual', name);

  return function(err) {
    if (err) return cb(err);
    assert(existsSync(filepath));
    del(filepath, cb);
  }
}

function generic(gen) {
  gen.task('default', function() {
    console.log(gen.namespace, 'task >', this.name);
    cb();
  });
}

describe('generate-file', function() {
  beforeEach(function() {
    app = generate({cli: true, silent: true});
    // temporary
    app.generator('defaults', function() {});
    app.option('renameKey', function(key, view) {
      return view ? view.stem : path.basename(key, path.extname(key));
    });
  });

  after(function(cb) {
    del('actual', cb);
  });

  describe('plugin', function() {
    it('should only register the plugin once', function(cb) {
      var count = 0;
      app.on('plugin', function(name) {
        if (name === 'generate-file') {
          count++;
        }
      });
      app.use(generator());
      app.use(generator());
      app.use(generator());
      assert.equal(count, 1);
      cb();
    });
  });

  describe('generator', function() {
    it('should work as a plugin', function() {
      app.use(generator());
      assert(app.tasks.hasOwnProperty('default'));
    });

    it('should create tasks with the name of each view on the `templates` collection', function() {
      app.template('foo.md', {content: 'this is foo'});
      app.template('bar.md', {content: 'this is bar'});
      app.template('baz.md', {content: 'this is baz'});

      app.use(generator());
      assert(app.tasks.hasOwnProperty('foo'));
      assert(app.tasks.hasOwnProperty('bar'));
      assert(app.tasks.hasOwnProperty('baz'));
      assert(!app.tasks.hasOwnProperty('qux'));
    });

    it('should create tasks with the name of each view on the given collection', function() {
      app.create('pages');
      app.pages('one.md', {content: 'this is one'});
      app.pages('two.md', {content: 'this is two'});
      app.pages('three.md', {content: 'this is three'});

      app.use(generator({views: app.views.pages}));
      assert(app.tasks.hasOwnProperty('one'));
      assert(app.tasks.hasOwnProperty('two'));
      assert(app.tasks.hasOwnProperty('three'));
      assert(!app.tasks.hasOwnProperty('foo'));
    });

    it('should generate a file', function(cb) {
      app.option('dest', path.resolve(__dirname, 'actual'));
      app.template('foo.md', {content: 'this is foo'});
      app.use(generator());

      app.generate('foo', exists('foo.md', cb));
    });

    it('should generate a file with the given default task', function(cb) {
      var expected = path.resolve(__dirname, 'actual/foo.md');

      app.option('dest', path.resolve(__dirname, 'actual'));
      app.template('foo.md', {content: 'this is foo'});
      app.use(generator({default: 'foo'}));

      app.generate(function(err) {
        if (err) return cb(err);
        assert(existsSync(expected));
        del(expected, cb);
      });
    });

    it('should generate multiple files with the given default task', function(cb) {
      var foo = path.resolve(__dirname, 'actual/foo.md');
      var bar = path.resolve(__dirname, 'actual/bar.md');

      app.option('dest', path.resolve(__dirname, 'actual'));
      app.template('foo.md', {content: 'this is foo'});
      app.template('bar.md', {content: 'this is bar'});
      app.use(generator({default: ['foo', 'bar']}));

      app.generate(function(err) {
        if (err) return cb(err);
        assert(existsSync(foo));
        assert(existsSync(bar));
        del([foo, bar], cb);
      });
    });

    it('should register as a generator', function() {
      app.register('file', generator());
      assert(app.generators.hasOwnProperty('file'));
    });

    it('should generate a file on a generator registered with `.generator`', function(cb) {
      var expected = path.resolve(__dirname, 'actual/nested/foo.md');
      app.option('dest', path.resolve(__dirname, 'actual/nested'));
      app.template('foo.md', {content: 'this is foo'});

      app.generator('file', generator({views: app.views.templates}));
      app.generate('file:foo', function(err) {
        if (err) return cb(err);
        assert(existsSync(expected));
        cb();
      });
    });

    it('should generate a file on a generator registered with `.register`', function(cb) {
      var expected = path.resolve(__dirname, 'actual/nested/bar.md');
      app.option('dest', path.resolve(__dirname, 'actual/nested'));
      app.template('bar.md', {content: 'this is bar'});

      app.register('file', generator({views: app.views.templates}));
      app.generate('file:bar', function(err) {
        if (err) return cb(err);
        assert(existsSync(expected));
        cb();
      });
    });

    it('should generate a file on a nested sub-generator', function(cb) {
      var expected = path.resolve(__dirname, 'actual/nested/bar.md');
      app.option('dest', path.resolve(__dirname, 'actual/nested'));
      app.template('bar.md', {content: 'this is bar'});

      app
        .register('foo', generic)
        .register('bar', generic)
        .register('baz', generic)
        .register('file', generator({views: app.views.templates}))

      app.generate('foo.bar.baz.file:bar', function(err) {
        if (err) return cb(err);
        assert(existsSync(expected));
        cb();
      });
    });
  });
});
