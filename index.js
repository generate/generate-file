'use strict';

var path = require('path');
var cwd = path.resolve.bind(path, __dirname, 'templates');
var isValidInstance = require('is-valid-instance');
var isRegistered = require('is-registered');

/**
 * Creates a task for generating a single file for each `view` passed on `options.views`.
 * If `options.views` is undefined, the `templates` collection is used.
 *
 * ```js
 * var file = require('generate-file');
 *
 * // use as a plugin
 * var generate = require('generate');
 * var app = generate();
 * app.template('license', {contents: fs.readFileSync('LICENSE')});
 * app.use(file());
 *
 * app.generate('license', function(err) {
 *   if (err) return console.error(err);
 * });
 *
 * // use as a plugin in your generator
 * module.exports = function(app) {
 *   app.use(file());
 *   // do other generator stuff
 * };
 *
 * // use as a sub-generator
 * module.exports = function(app) {
 *   app.register('foo', file());
 *   // do other generator stuff
 *
 *   app.task('default', function(cb) {
 *     // run task `bar` on sub-generator `foo`
 *     app.generate('foo:bar', cb);
 *   });
 * };
 * ```
 * @param {Object} `options`
 * @api public
 */

module.exports = function(config) {
  config = config || {};

  return function(app, base, env, options) {
    if (!isValid(app)) return;

    app.option(config);
    var dest = path.resolve(app.option('dest') || app.cwd);
    var views = config.views || app.views.templates || {};

    for (var key in views) {
      task(app, views[key], dest);
    }

    app.task('default', {silent: true}, config.default);
  };
};

/**
 * Generate a file to the specified destination.
 *
 * Also, since views are _either_ passed on options are pre-loaded
 * on the templates collection, to be safe we'll (re)-set the view
 * on the `templates` collection JIT to ensure it exists on the
 * collection when we call `.toStream()`
 */

function file(app, view, dest, cb) {
  app.engine('*', require('engine-base'));
  app.templates.setView(view);
  app.toStream('templates', view.path)
    .pipe(app.renderFile(view.engine))
    .pipe(app.conflicts(dest))
    .pipe(app.dest(dest))
    .on('error', cb)
    .on('end', cb);
}

/**
 * Create a task for generating a file.
 */

function task(app, view, dest) {
  app.task(view.stem, function(cb) {
    file(app, view, dest, cb);
  });
}

/**
 * Return true if `app` is a valid instance
 */

function isValid(app) {
  if (!isValidInstance(app)) {
    return false;
  }
  if (isRegistered(app, 'generate-file')) {
    return false;
  }
  return true;
}

/**
 * Expose `file` function as `.create` (so it's not `file.file`)
 */

module.exports.create = file;

/**
 * Expose `task` function as `.task`
 */

module.exports.task = task;
