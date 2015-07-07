/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Compiles and deploys fonts to the /<%= paths.tmp %> directory.
 */

var config = require('./config');
var gulp = require('gulp');

gulp.task('fonts', function()
{
    return gulp.src([config.paths.src+'/static/**/*.'+config.patterns.fonts<% if (includeBootstrap) { %><% if (css == 'Sass') { %>, 'node_modules/bootstrap-sass/assets/**/*.'+config.patterns.fonts<% } else { %>, 'node_modules/bootstrap/**/*.'+config.patterns.fonts<% } %><% } %>])
        .pipe(gulp.dest(config.paths.tmp+'/static'));
});
