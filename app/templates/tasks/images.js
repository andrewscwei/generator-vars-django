/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Compiles and deploys images to the /<%= paths.tmp %> directory.
 *
 *  @param {Boolean} debug
 *  @param {Boolean} skip-imagemin
 */

var config = require('./config');
var gulp = require('gulp');
var $if = require('gulp-if');
var $imagemin = require('gulp-imagemin');

gulp.task('images', function()
{
    return gulp.src([config.paths.src+'/static/**/*'+config.patterns.images])
        .pipe($if(!config.env.skipImageMin, $imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{cleanupIDs: false}]
        })))
        .pipe(gulp.dest(config.paths.tmp+'/static'));
});
