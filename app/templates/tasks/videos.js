/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Compiles and deploys videos to the /<%= paths.tmp %> directory.
 */

var config = require('./config');
var gulp = require('gulp');

gulp.task('videos', function()
{
    return gulp.src([config.paths.src+'/static/**/*'+config.patterns.videos])
        .pipe(gulp.dest(config.paths.tmp+'/static'));
});
