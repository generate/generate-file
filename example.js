'use strict';

var file = require('./');
var generate = require('generate');
var app = generate({cli: true});

// app.option('silent', 'foo');

// create an arbitrary template collection, or use
// the built-in generic collection `templates`
app.create('docs');

// add some views (a task will be created using the filename
// of each view, so you can run `foo` to generate the `foo` file)
app.doc('foo', {content: 'this is an example template'});
app.doc('bar', {content: 'another example template'});
app.doc('baz', {content: 'another example template'});

// pass the collection on `options.views`, or if nothing
// is passed the `templates` view collection will be used
app.use(file({views: app.views.docs}));
app.on('dest', function(file, dest) {
  file.extname = '.hbs';
  file.dest = 'foo';
});

app.build(['foo', 'bar', 'baz'], function(err) {
  if (err) return console.error(err);
  app.emit('done', 'build');
});
