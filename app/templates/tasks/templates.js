/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Processes all template files (i.e. HTML) and deploys them to the /<%= paths.build %> directories.
 *
 *  @param {Boolean} debug
 *  @param {Boolean} skip-minify-html
 */

var config = require('./config');
var gulp = require('gulp');
var $if = require('gulp-if');
var $minifyHTML = require('gulp-minify-html');

gulp.task('templates', function()
{
    return gulp.src([config.paths.src+'/templates/**/*.'+config.patterns.templates, config.paths.src+'/templates/robots.txt'])
        .pipe($if(!config.env.skipMinifyHTML, $minifyHTML({empty: true, conditionals: true, loose: true })))
        .pipe(gulp.dest(config.paths.build+'/templates'));
});
