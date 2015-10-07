/**
 * <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 * (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 */

var autoprefixer = require('autoprefixer-core');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var config = require('./.taskconfig');
var del = require('del');
var gulp = require('gulp');
var merge = require('merge-stream');
var path = require('path');
var source = require('vinyl-source-stream');
var spawn = require('child_process').spawn;
var through2 = require('through2');
var watchify = require('watchify');
var $concat = require('gulp-concat');
var $csso = require('gulp-csso');
var $if = require('gulp-if');
var $minifyHTML = require('gulp-minify-html');
var $postcss = require('gulp-postcss');<% if (css == 'Stylus') { %>
var $stylus = require('gulp-stylus');<% } else if (css == 'Sass') { %>
var $sass = require('gulp-sass');<% } %>
var $size = require('gulp-size');
var $sourcemaps = require('gulp-sourcemaps');
var $uglify = require('gulp-uglify');
var $util = require('gulp-util');

/**
 * Compiles and deploys images.
 *
 * @param {Boolean} debug
 */
gulp.task('images', function() {
  return gulp.src(config.images.entry)
    .pipe($size({
      title: '[images]',
      gzip: true
    }))
    .pipe(gulp.dest(config.images.output));
});

/**
 * Compiles and deploys videos.
 */
gulp.task('videos', function() {
  return gulp.src(config.videos.entry)
    .pipe($size({
      title: '[videos]',
      gzip: true
    }))
    .pipe(gulp.dest(config.videos.output));
});

/**
 * Compiles and deploys fonts.
 */
gulp.task('fonts', function() {
  return gulp.src(config.fonts.entry)
    .pipe($size({
      title: '[fonts]',
      gzip: true
    }))
    .pipe(gulp.dest(config.fonts.output));
});

/**
 * Compiles and deploys stylesheets.
 *
 * @param {Boolean} css-sourcemaps
 * @param {Boolean} debug
 * @param {Boolean} skip-css-min
 */
gulp.task('styles', function() {
  return merge(
    gulp.src(config.styles.entry)
      .pipe($if(config.env.cssSourcemaps, $sourcemaps.init()))<% if (css == 'Stylus') { %>
      .pipe($stylus(config.styles.stylus).on('error', function(err) {
        $util.log($util.colors.red('[stylus] Error: ' + err.message));
        this.emit('end');
      }))<% } else if (css == 'Sass') { %>
      .pipe($sass(config.styles.sass).on('error', function(err) {
        $util.log($util.colors.red('[sass] Error: ' + err.message));
        this.emit('end');
      }))<% } %>
      .pipe($postcss([autoprefixer(config.styles.autoprefixer)]))
      .pipe($if(config.env.cssSourcemaps, $sourcemaps.write()))
      .pipe($if(!config.env.skipCSSMin, $csso()))
      .pipe($size({
        title: '[styles:app]',
        gzip: true
      }))
      .pipe(gulp.dest(config.styles.output)),
    gulp.src(config.styles.vendorEntry)
      .pipe($concat(config.styles.vendorFileName))
      .pipe($if(!config.env.skipCSSMin, $csso()))
      .pipe($size({
        title: '[styles:vendor]',
        gzip: true
      }))
      .pipe(gulp.dest(config.styles.vendorOutput))
  );
});

/**
 * Compiles all JavaScript bundle files. This task assumes that all bundle files are located in /<%= paths.src %>/_assets/js
 * and ignores all sub-directories. Watchify is used to speed up the rebundling process when watch is enabled.
 * Babelify is used to allow development in ES6 standards.
 *
 * @param {Boolean} debug
 * @param {Boolean} js-sourcemaps
 * @param {Boolean} skip-js-min
 * @param {Boolean} watch
 */
gulp.task('scripts', function() {
  function bundle(bundler, output, next) {
    return bundler.bundle()
      .on('error', function(err) {
        $util.log($util.colors.red('[browserify] Error: ' + err.message));

        if (next) {
          next();
        } else {
          this.emit('end');
        }
      })
      .pipe(source(output))
      .pipe(buffer())
      .pipe($if(config.env.jsSourcemaps, $sourcemaps.init({
        loadMaps: true
      })))
      .pipe($if(!config.env.skipJSMin, $uglify())).on('error', $util.log)
      .pipe($if(config.env.jsSourcemaps, $sourcemaps.write('./')))
      .pipe(gulp.dest(config.scripts.output));
  }

  return merge(
    gulp.src(config.scripts.entry)
      .pipe(through2.obj(function(file, enc, next) {
        var opts = {
          entries: [file.path],
          debug: config.debug,
          transform: [babelify]
        };
        var bundler = (config.env.watch) ? watchify(browserify(opts)) : browserify(opts);
        var output = file.path.replace(file.base, '');

        if (config.env.watch) {
          bundler.on('time', function(time) {
            $util.log($util.colors.green('[browserify]'), output, $util.colors.magenta('in ' + time + 'ms'));
          });

          bundler.on('update', function() {
            bundle(bundler, output);
          });
        }

        bundle(bundler, output, next)
          .on('end', function() {
            next(null, file);
          });
      })),
    gulp.src(config.scripts.vendorEntry)
      .pipe($concat(config.scripts.vendorFileName))
      .pipe($if(!config.env.skipJSMin, $uglify()))
      .on('error', function(err) {
        $util.log($util.colors.red('Vendor scripts error: ' + err.message));
        this.emit('end');
      })
      .pipe($size({
        title: '[scripts:vendor]',
        gzip: true
      }))
      .pipe(gulp.dest(config.scripts.vendorOutput))
  );
});

/**
 * Compiles and deploys core files.
 */
gulp.task('core', function() {
  return gulp.src(config.core.entry, { dot: true })
    .pipe(gulp.dest(config.core.output));
});

/**
 * Processes all static files (i.e. images, stylesheets, scripts, etc) and deploys them.
 *
 * @param {Boolean} css-sourcemaps
 * @param {Boolean} debug
 * @param {Boolean} js-sourcemaps
 * @param {Boolean} skip-css-min
 * @param {Boolean} skip-js-min
 * @param {Boolean} watch
 */
gulp.task('static', ['images', 'videos', 'fonts', 'styles', 'scripts']);

/**
 * Processes all template files (i.e. HTML) and deploys them.
 *
 * @param {Boolean} debug
 * @param {Boolean} skip-html-min
 */
gulp.task('templates', function() {
  return gulp.src(config.templates.entry)
    .pipe($if(!config.env.skipHTMLMin, $minifyHTML(config.templates.minifyHTML)))
    .pipe($size({
      title: '[templates]',
      gzip: true
    }))
    .pipe(gulp.dest(config.templates.output));
});

/**
 * Builds the entire app with option to apply revisioning (via Django's
 * 'collectstatic' command).
 *
 * @param {Boolean} debug
 */
gulp.task('build', ['core', 'templates', 'static'], function(done) {
  if (!config.debug) {
    spawn('python', [path.join(config.paths.src, 'manage.py'), 'collectstatic', '--noinput'], {
      stdio: 'inherit'
    }).on('exit', function(code) {
      if (code === 0) {
        var manifestFile = path.join(config.paths.build, 'static', 'staticfiles.json');
        var manifest = require(manifestFile).paths;
        var arr = [];

        for (var f in manifest) {
          if (f !== manifest[f]) {
            arr.push(path.join(config.paths.build, 'static', f));
          }
        }

        arr.push(config.paths.tmp);

        del(arr).then(function(paths) {
          done();
        });
      }
      else {
        return;
      }
    });
  }
  else {
    done();
  }
});
