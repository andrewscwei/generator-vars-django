<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>

const config = require('./.taskconfig');
const del = require('del');
const gulp = require('gulp');

/**
 * Cleans /<%= paths.tmp %> and /<%= paths.build %> directories.
 */
gulp.task('clean', function(callback) {
  del(config.clean.entry).then(function(paths) {
    callback();
  });
});
