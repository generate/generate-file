# generate-file [![NPM version](https://img.shields.io/npm/v/generate-file.svg?style=flat)](https://www.npmjs.com/package/generate-file) [![NPM downloads](https://img.shields.io/npm/dm/generate-file.svg?style=flat)](https://npmjs.org/package/generate-file) [![Build Status](https://img.shields.io/travis/generate/generate-file.svg?style=flat)](https://travis-ci.org/generate/generate-file)

Generator for generating a single file from a template.

## What is generate?

Generate is a new, open source developer framework for rapidly initializing and scaffolding out new code projects, offering an intuitive CLI, and a powerful and expressive API that makes it easy and enjoyable to use.

Visit the [getting started guide](https://github.com/generate/getting-started-guide) or the [generate](https://github.com/generate/generate) project and documentation to learn more.

## Quickstart

generate-file is a [node.js](https://nodejs.org/en/) application that is installed using [npm](https://www.npmjs.com/). If you're unfamiliar with generate, it might help to visit the [generate](https://github.com/generate/generate) readme, or visit the [getting started guide](https://github.com/generate/getting-started-guide) before continuing on.

**Usage**

* [CLI usage](#cli)
* [API usage](#api)

***

### CLI

**Installing the CLI**

To run the `file` generator from the command line, you'll need to install [generate](https://github.com/generate/generate) globally first. You can do that now with the following command:

```sh
$ npm i -g generate
```

This adds the `gen` command to your system path, allowing it to be run from any directory.

**Help**

Get general help and a menu of available commands:

```sh
$ gen help
```

**Running the `file` generator**

Once both [generate](https://github.com/generate/generate) and `generate-file` are installed globally, you can run the generator with the following command:

```sh
$ gen file
```

If completed successfully, you should see both `starting` and `finished` events in the terminal, like the following:

```sh
[00:44:21] starting ...
...
[00:44:22] finished ✔
```

If you do not see one or both of those events, please [let us know about it](../../issues).

### Tasks

The following tasks are registered on the `file` generator.

***

### API

**Use as a plugin in your generator**

Use as a plugin if you want to extend your own generator with the features, settings and tasks of generate-file, as if they were created on your generator.

In your [generator.js](#overview):

```js
module.exports = function(app) {
  app.use(require('generate-file'));

  // specify any tasks from generate-file. Example:
  app.task('default', ['file']);
};
```

**Use as a sub-generator**

Use as a sub-generator if you want expose the features, settings and tasks from generate-file on a _namespace_ in your generator.

In your [generator.js](#overview):

```js
module.exports = function(app) {
  // register the generate-file generator (as a sub-generator with an arbitrary name)
  app.register('foo', require('generate-file'));

  app.task('minify', function(cb) {
    // minify some stuff
    cb();
  });

  // run the "default" task on generate-file (aliased as `foo`), 
  // then run the `minify` task defined in our generator
  app.task('default', function(cb) {
    app.generate(['foo:default', 'minify'], cb);
  });
};
```

Tasks from `generate-file` will be available on the `foo` namespace from the API and the command line. Continuing with the previous code example, to run the `default` task on `generate-file`, you would run `gen foo:default` (or just `gen foo` if `foo` does not conflict with an existing task on your generator).

To learn more about namespaces and sub-generators, and how they work, [visit the getting started guide](https://github.com/generate/getting-started-guide).

***

## Examples

This generator returns a function that needs to be called, so you can pass an options object if you need to customize anything.

```js
var file = require('generate-file');
var generate = require('generate');
var app = generate();

// create an arbitrary template collection, or use
// the built-in generic collection `templates`
app.create('docs');

// add some views (a task will be created using the filename
// of each view, so you can run `foo` to generate the `foo` file)
app.doc('foo', {content: 'this is an example template'});
app.doc('bar', {content: 'another example template'});

// pass the collection on `options.views`, or if nothing
// is passed the `templates` view collection will be used
app.use(file({views: app.views.docs}));
```

**Defaults**

The following example shows how to use a custom collection. See the [API docs](#api) below for an example of how to use the built-in generic `templates` collection.

```js
var file = require('generate-file');
var generate = require('generate');
var app = generate();

// create an arbitrary template collection, or use
// the built-in generic collection `templates`
app.create('docs');

// add some views (a task will be created using the filename
// of each view, so you can run `foo` to generate the `foo` file)
app.doc('foo', {content: 'this is an example template'});
app.doc('bar', {content: 'another example template'});

// pass the collection on `options.views`, or if nothing
// is passed the `templates` view collection will be used
app.use(file({views: app.views.docs}));
```

## Related projects

You might also be interested in these projects:

* [generate-dest](https://www.npmjs.com/package/generate-dest): `Generate` generator that prompts the user for the destination directory to use. Can be used… [more](https://www.npmjs.com/package/generate-dest) | [homepage](https://github.com/generate/generate-dest)
* [generate-node](https://www.npmjs.com/package/generate-node): Generate a node.js project, with everything you need to begin writing code and easily publish… [more](https://www.npmjs.com/package/generate-node) | [homepage](https://github.com/generate/generate-node)
* [generate](https://www.npmjs.com/package/generate): Fast, composable, highly pluggable project generator with a user-friendly and expressive API. | [homepage](https://github.com/generate/generate)

## Contributing

This document was generated by [verb](https://github.com/verbose/verb), please don't edit directly. Any changes to the readme must be made in [.verb.md](.verb.md). See [Building Docs](#building-docs).

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/generate/generate-file/issues/new).

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-readme-generator && verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/generate/generate-file/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on June 01, 2016._