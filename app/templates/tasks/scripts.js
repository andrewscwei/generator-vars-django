/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 * Compiles all JavaScript bundle files. This task assumes that all bundle files are located in /<%= paths.src %>/static/{app_name}/js
 * and ignores all sub-directories. Watchify is used to speed up the rebundling process when watch is enabled.
 * Babelify is used to allow development in ES6 standards.
 *
 * @param {Boolean} debug
 * @param {Boolean} skip-uglify
 * @param {Boolean} watch
 */

var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var config = require('./config');
var gulp = require('gulp');
var merge = require('merge-stream');
var source = require('vinyl-source-stream');
var through2 = require('through2');
var watchify = require('watchify');
var $concat = require('gulp-concat');
var $if = require('gulp-if');
var $sourcemaps = require('gulp-sourcemaps');
var $uglify = require('gulp-uglify');
var $util = require('gulp-util');

gulp.task('scripts', function()
{
  function bundle(bundler, output, next)
  {
    return bundler.bundle()
      .on('error', function(err)
      {
        $util.log($util.colors.red('Browserify error: ' + err.message));

        if (next)
        {
          next();
        }
        else
        {
          this.emit('end');
        }
      })
      .pipe(source(output))
      .pipe(buffer())
      .pipe($if(config.env.debug, $sourcemaps.init({ loadMaps: true })))
      .pipe($if(!config.env.skipUglify, $uglify())).on('error', $util.log)
      .pipe($if(config.env.debug, $sourcemaps.write('./')))
      .pipe(gulp.dest(config.paths.tmp+'/static'));
  }

    return merge
    (
        gulp.src(config.paths.src+'/static/**/js/*.'+config.patterns.scripts)
            .pipe(through2.obj(function(file, enc, next)
            {
                var opts = { entries: [file.path], debug: config.env.debug, transform: [babelify] };
                var bundler = (config.env.watch) ? watchify(browserify(opts)) : browserify(opts);
                var output = file.path.replace(file.base, '');

                if (config.env.watch)
                {
                    bundler.on('time', function(time)
                    {
                        $util.log($util.colors.green('Browserified'), output, $util.colors.magenta('in ' + time + 'ms'));
                    });

                    bundler.on('update', function()
                    {
                        bundle(bundler, output);
                    });
                }

                bundle(bundler, output, next)
                .on('end', function()
                {
                    next(null, file);
                });
            })),
        gulp.src([config.paths.src+'/static/vendor/**/*.'+config.patterns.scripts])
            .pipe($concat('vendor.js'))
            .pipe($if(!config.env.skipUglify, $uglify()))
                .on('error', function(err)
                {
                    $util.log($util.colors.red('Vendor scripts error: ' + err.message));

                    this.emit('end');
                })
            .pipe(gulp.dest(config.paths.tmp+'/static/vendor'))
    );
});
