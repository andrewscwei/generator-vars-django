/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  Processes all static files (i.e. images, stylesheets, scripts, etc) and deploys them to the /<%= paths.tmp %> directory.
 *  These static files are then deployed to the /<%= paths.build %> directory.
 *
 *  @param {Boolean} --debug
 */

var config = require('./config');
var gulp = require('gulp');
var spawn = require('child_process').spawn;

gulp.task('static', ['images', 'videos', 'fonts', 'styles', 'scripts', 'extras'], function(callback)
{
    if (config.env.debug)
    {
        gulp.src([config.paths.tmp+'/static/**/*'], { dot: true })
            .pipe(gulp.dest(config.paths.build+'/static'));

        callback();
    }
    else
    {
        spawn('python', [config.paths.src+'/manage.py', 'collectstatic', '--noinput'], { stdio: 'inherit' }).on('exit', function(code)
        {
            if (code === 0)
            {
                callback();
            }
            else
            {
                return;
            }
        });
    }
});
