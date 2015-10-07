/**
 * <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 * (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 */

var config = require('./.taskconfig');
var gulp = require('gulp');
var path = require('path');
var spawn = require('child_process').spawn;

/**
 * Runs Django shell.
 */
gulp.task('shell', function() {
  spawn('python', [path.join(config.paths.src, 'manage.py'), 'shell'], {
    stdio: 'inherit'
  });
});

/**
 * Runs Django migration.
 */
gulp.task('migrate', function() {
  spawn('python', [path.join(config.paths.src, 'manage.py'), 'migrate'], {
    stdio: 'inherit'
  });
});
