/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Cleans /<%= paths.tmp %> and /<%= paths.build %> directories.
 */

var config = require('./config');
var gulp = require('gulp');

gulp.task('clean', function(callback)
{
    require('del')([config.paths.tmp+'', config.paths.build+''], function()
    {
        callback();
    });
});
