/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Runs Django shell.
 */

var config = require('./config');
var gulp = require('gulp');
var spawn = require('child_process').spawn;

gulp.task('shell', function()
{
    spawn('python', [config.paths.src+'/manage.py', 'shell'], { stdio: 'inherit' });
});
