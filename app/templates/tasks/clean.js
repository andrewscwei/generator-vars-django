<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>

var config = require('./.taskconfig');
var del = require('del');
var gulp = require('gulp');

/**
 * Cleans /<%= paths.tmp %> and /<%= paths.build %> directories.
 */
gulp.task('clean', function(callback) {
  del(config.clean.entry).then(function(paths) {
    callback();
  });
});
