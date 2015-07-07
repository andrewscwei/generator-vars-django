/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 * 	Builds the entire app from /<%= paths.src %> -> /<%= paths.tmp %> -> /<%= paths.build %>.
 *
 *  @param {Boolean} debug
 */

var config = require('./config');
var gulp = require('gulp');
var sequence = require('run-sequence');

gulp.task('build', function(callback)
{
     if (config.env.debug)
     {
         sequence('templates', 'static', 'deploy', callback);
     }
     else
     {
         sequence('templates', 'static', 'deploy', callback);
     }
});
