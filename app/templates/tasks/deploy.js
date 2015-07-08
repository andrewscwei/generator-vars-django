/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Deploys app misc files to the /<%= paths.build %> directory (excluding static and template files).
 */

var config = require('./config');
var gulp = require('gulp');

gulp.task('deploy', function()
{
    return gulp.src([config.paths.src+'/**/*', '!'+config.paths.src+'/{static,templates}/**/*'])
        .pipe(gulp.dest(config.paths.build));
});
