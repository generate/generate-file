'use strict';

var path = require('path');
var debug = require('debug')('generate:file');
var utils = require('./utils');

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

function generator(config) {
  config = config || {};

  return function(app, base, env, options) {
    if (!utils.isValid(app, 'generate-file')) return;
    debug('initializing "%s", from "%s"', __filename, module.parent.id);

    createTasks(app, init(app, config, options));
    app.task('default', {silent: true}, config.default);
    app.task('file', config.default);
  };
}

/**
 * Create a task for each view in the specified collection
 */

function createTasks(app, options) {
  if (options.collection && !app.views.hasOwnProperty(options.collection)) {
    app.create(options.collection, options);
  }

  var views = options.views || app.views[options.collection];
  var keys = Object.keys(views);

  keys.forEach(function(key) {
    createTask(app, views[key], options);
  });
  return keys;
}

/**
 * Create a task for generating a file.
 */

function createTask(app, view, options) {
  if (!utils.isObject(view) || !view.isView) {
    throw new Error('expected a view');
  }

  if (options.default === view.key || view.default === true) {
    app.task('default', view.key);
  }

  app.task(utils.dashify(view.key), function(cb) {
    toStream(app, view, options, cb);
  });
}

/**
 * Generate a file to the specified directory.
 *
 * Also, since views are _either_ passed on options are pre-loaded
 * on the templates collection, to be safe we'll (re)-set the view
 * on the `templates` collection JIT to ensure it exists on the
 * collection when we call `.toStream()`
 */

function toStream(app, view, options, cb) {
  app[options.collection].setView(view);
  app.toStream(options.collection, view.path)
    .pipe(app.renderFile('*'))
    .pipe(app.conflicts(options.dest))
    .pipe(app.dest(function(file) {
      app.emit('dest', file, options.dest);
      return file.dest || options.dest;
    }))
    .on('error', cb)
    .on('end', cb);
}

/**
 * Initialize defaults for the generator. Adds middleware for renaming
 * dest files and parsing front-matter, and an engine for rendering
 * ERB-style templates (like lo-dash/underscore templates: `<%= foo %>`)
 *
 * This is wrapped in a function so we can export it on the `.init` property
 * in case you need to call it directly in your generator. This also returns
 * an options object created from merging generator options, instance options,
 * and defaults, so you can override this if necessary.
 */

function init(app, config, options) {
  app.use(utils.conflicts());

  // merge `config` object onto options
  if (!config.isApp) {
    app.option(config);
  }

  var defaults = { engine: '*', dest: app.cwd, collection: 'templates' };
  var opts = utils.extend(defaults, app.options);
  app.use(utils.defaults);

  // ensure the `templates` collection exists. This doesn't really
  // need to be done, but it allows the generator to be used with
  // verb and assemble with no additional config
  if (typeof app[opts.collection] === 'undefined') {
    app.create(opts.collection, opts);
  }

  // remove or rename template prefixes before writing files to the file system
  app.preWrite(/\.js$/, function(file, next) {
    file.basename = file.basename.replace(/^_/, '.').replace(/^\$/, '');
    next();
  });
  return opts;
}

/**
 * Expose functions on exports so they can be called directly
 * if customization is necessary
 */

generator.init = init;
generator.toStream = toStream;
generator.task = createTask;
generator.tasks = createTasks;
module.exports = generator;
