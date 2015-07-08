/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Serves the app locally. In production, watch option is not supported. This is meant for
 *  development only.
 *
 *  @param {Boolean} debug
 *  @param {Number}  port
 *  @param {Boolean} watch
 */

var browserSync = require('browser-sync');
var config = require('./config');
var gulp = require('gulp');
var sequence = require('run-sequence');
var spawn = require('child_process').spawn;
var $util = require('gulp-util');

gulp.task('serve', function()
{
    if (config.env.watch && !config.env.debug)
    {
        $util.log($util.colors.yellow('Watch is not supported in production. Please specify ') + '--debug' + $util.colors.yellow(' instead.'));
        return;
    }

    if (config.env.debug)
    {
        spawn('python', [config.paths.src+'/manage.py', 'runserver', '0.0.0.0:3000', '--insecure'], { stdio: 'inherit' });
    }
    else
    {
        spawn('python', [config.paths.build+'/manage.py', 'runserver', '0.0.0.0:3000', '--insecure', '--settings=project.settings.prod'], { stdio: 'inherit' });
    }

    browserSync(
    {
        notify: false,
        proxy: '0.0.0.0:3000',
        port: (typeof config.env.port === 'number') ? config.env.port : 9000
    });

    if (config.env.watch)
    {
        gulp.watch(config.paths.src+'/**/*.'+config.patterns.images, function() { sequence('images', browserSync.reload); });
        gulp.watch(config.paths.src+'/**/*.'+config.patterns.videos, function() { sequence('videos', browserSync.reload); });
        gulp.watch(config.paths.src+'/**/*.'+config.patterns.styles, function() { sequence('styles', browserSync.reload); });
        gulp.watch(config.paths.src+'/**/*.'+config.patterns.fonts, function() { sequence('fonts', browserSync.reload); });
        gulp.watch(config.paths.src+'/**/*.'+config.patterns.templates, function() { sequence('templates', browserSync.reload); });
        gulp.watch(config.paths.tmp+'/**/*.'+config.patterns.scripts, function() { sequence(browserSync.reload); });
    }
});
