<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>

const autoprefixer = require('autoprefixer');
const babelify = require('babelify');
const browserify = require('browserify');
const browserSync = require('browser-sync');
const buffer = require('vinyl-buffer');
const config = require('./.taskconfig');
const cssnano = require('cssnano');
const del = require('del');
const gulp = require('gulp');
const path = require('path');
const source = require('vinyl-source-stream');
const spawn = require('child_process').spawn;
const through2 = require('through2');
const watchify = require('watchify');
const $if = require('gulp-if');
const $htmlmin = require('gulp-htmlmin');
const $postcss = require('gulp-postcss');<% if (css == 'Stylus') { %>
const $stylus = require('gulp-stylus');<% } else if (css == 'Sass') { %>
const $sass = require('gulp-sass');<% } %>
const $size = require('gulp-size');
const $sourcemaps = require('gulp-sourcemaps');
const $uglify = require('gulp-uglify');
const $util = require('gulp-util');

gulp.task('images', function() {
  return gulp.src(config.images.entry)
    .pipe($size({ title: '[images]', gzip: true }))
    .pipe(gulp.dest(config.images.output));
});

gulp.task('videos', function() {
  return gulp.src(config.videos.entry)
    .pipe($size({ title: '[videos]', gzip: true }))
    .pipe(gulp.dest(config.videos.output));
});

gulp.task('fonts', function() {
  return gulp.src(config.fonts.entry)
    .pipe($size({ title: '[fonts]', gzip: true }))
    .pipe(gulp.dest(config.fonts.output));
});

gulp.task('extras', function() {
  return gulp.src(config.extras.entry)
    .pipe($size({ title: '[extras]', gzip: true }))
    .pipe(gulp.dest(config.extras.output));
})

/**
 * Compiles and deploys stylesheets.
 */
gulp.task('styles', function() {
  let postcssPlugins = [autoprefixer(config.styles.autoprefixer)];
  if (config.debug) postcssPlugins.push(cssnano());

  return gulp.src(config.styles.entry)
    .pipe($if(config.debug, $sourcemaps.init()))<% if (css == 'Stylus') { %>
    .pipe($stylus(config.styles.stylus).on('error', function(err) {
      if (config.env.watch) {
        // When watching, don't kill the process.
        $util.log($util.colors.blue(`[stylus]`), $util.colors.red(err.message));
        this.emit('end');
      }
      else {
        throw new $util.PluginError('stylus', err.message);
      }
    }))<% } else if (css == 'Sass') { %>
    .pipe($sass(config.styles.sass).on('error', function(err) {
      if (config.env.watch) {
        // When watching, don't kill the process.
        $util.log($util.colors.blue(`[sass]`), $util.colors.red(err));
        this.emit('end');
      }
      else {
        throw new $util.PluginError('sass', err);
      }
    }))<% } %>
    .pipe($postcss(postcssPlugins))
    .pipe($if(config.debug, $sourcemaps.write()))
    .pipe($size({ title: '[styles]', gzip: true }))
    .pipe(gulp.dest(config.styles.output));
});

/**
 * Compiles all JavaScript bundle files. This task assumes that all bundle files
 * are located in /<%= paths.src %>/_assets/js and ignores all sub-directories.
 */
gulp.task('scripts', function() {
  let isWatching = false;

  return gulp.src(config.scripts.entry)
    .pipe(through2.obj(function(file, enc, next) {
      const opts = {
        entries: [file.path],
        debug: config.debug,
        transform: [babelify]
      };
      const bundler = (config.env.watch) ? watchify(browserify(opts)) : browserify(opts);
      const output = file.path.replace(file.base, '');

      if (config.env.watch) {
        bundler.on('time', function(time) { $util.log($util.colors.blue('[browserify]'), output, $util.colors.magenta('in ' + time + 'ms')); });
        bundler.on('update', function() { bundle(bundler, output); });
      }

      bundle(bundler, output, next).on('end', function() { next(null, file); });
    }));

  function bundle(bundler, output, next) {
    return bundler.bundle()
      .on('error', function(err) {
        $util.log($util.colors.blue('[browserify]'), $util.colors.red(`Error: ${err.message}`));
        if (next) next(); else this.emit('end');
      })
      .on('end', function() {
        if (isWatching) browserSync.reload();
        isWatching = config.env.watch;
      })
      .pipe(source(output))
      .pipe(buffer())
      .pipe($if(config.debug, $sourcemaps.init({ loadMaps: true })))
      .pipe($if(!config.debug, $uglify()))
      .pipe($if(config.debug, $sourcemaps.write('./')))
      .pipe(gulp.dest(config.scripts.output));
  }
});

/**
 * Compiles and deploys core files.
 */
gulp.task('core', function() {
  return gulp.src(config.core.entry, { dot: true })
    .pipe(gulp.dest(config.core.output));
});

/**
 * Processes all static files (i.e. images, stylesheets, scripts, etc) and
 * deploys them.
 */
gulp.task('static', ['images', 'videos', 'fonts', 'extras', 'styles', 'scripts']);

/**
 * Processes all template files (i.e. HTML) and deploys them.
 */
gulp.task('templates', function() {
  return gulp.src(config.templates.entry)
    .pipe($if(!config.debug, $htmlmin(config.templates.htmlmin)))
    .pipe($size({
      title: '[templates]',
      gzip: true
    }))
    .pipe(gulp.dest(config.templates.output));
});

/**
 * Builds the entire app with option to apply revisioning (via Django's
 * 'collectstatic' command).
 */
gulp.task('build', ['core', 'templates', 'static'], function(done) {
  if (!config.debug) {
    spawn('python', [path.join(config.paths.src, 'manage.py'), 'collectstatic', '--noinput'], {
      stdio: 'inherit'
    }).on('exit', function(code) {
      if (code === 0) {
        let manifestFile = path.join(config.paths.build, 'static', 'staticfiles.json');
        let manifest = require(manifestFile).paths;
        let arr = [];

        for (let f in manifest) {
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
