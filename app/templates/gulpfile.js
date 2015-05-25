/* jshint -W069, -W079 */

/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 */

'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

// Patterns.
var IMAGES_PATTERN = '{jpg,jpeg,gif,png,svg,ico}';
var VIDEOS_PATTERN = '{ogv,mp4}';
var SCRIPTS_PATTERN = 'js';
var STYLES_PATTERN = <% if (css == 'Stylus') { %>'{css,styl}'<% } else if (css == 'Sass') { %>'{css,scss}'<% } else { %>'css'<% } %>;
var SOURCEMAPS_PATTERN = '{css.map,js.map}';
var TEMPLATES_PATTERN = '{html,shtml,htm,html.erb,asp,php}';
var EXTRAS_PATTERN = 'txt';
var FONTS_PATTERN = '{eot,svg,ttf,woff,woff2}';

// Load modules.
var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var spawn = require('child_process').spawn;
var merge = require('merge-stream');
var sequence = require('run-sequence');

// Environment variables.
var debug = function() { return $.util.env['debug'] || $.util.env['d'] || process.env.GULP_CONFIG_DEBUG; };
var skipImageMin = function() { return $.util.env['skip-imagemin'] || $.util.env['si'] || debug(); };
var skipCSSO = function() { return $.util.env['skip-csso'] || $.util.env['sc'] || debug(); };
var skipUglify = function() { return $.util.env['skip-uglify'] || $.util.env['sj'] || debug(); };
var skipRev = function() { return $.util.env['skip-rev'] || $.util.env['sr'] || debug(); };
var skipMinifyHTML = function() { return $.util.env['skip-minify-html'] || $.util.env['sh'] || debug(); };
var skipRev = function() { return $.util.env['skip-rev'] || $.util.env['sr'] || debug(); };

/**
 * Compresses and deploys images to the temporary directory. Compression is skipped if --debug is specified.
 *
 * @param {Boolean} --debug         Specifies debug environment, skipping image compression.
 * @param {Boolean} --skip-imagemin Skips image compression.
 */
gulp.task('images', function()
{
    return gulp.src(['<%= paths.src %>/static/**/*'+IMAGES_PATTERN])
        .pipe($.if(!skipImageMin(), $.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{cleanupIDs: false}]
        })))
        .pipe(gulp.dest('<%= paths.tmp %>/static'));
});

/**
 * Deploys videos to the staging directory.
 */
gulp.task('videos', function()
{
    return gulp.src(['<%= paths.src %>/static/**/*'+VIDEOS_PATTERN])
        .pipe(gulp.dest('<%= paths.tmp %>/static'));
});

/**
 * Deploys all fonts from Bower components if applicable.
 */
gulp.task('fonts', function()
{
    return gulp.src(['<%= paths.src %>/static/**/*.'+FONTS_PATTERN<% if (includeBootstrap) { %><% if (css == 'Sass') { %>, 'node_modules/bootstrap-sass/assets/**/*.'+FONTS_PATTERN<% } else { %>, 'node_modules/bootstrap/**/*.'+FONTS_PATTERN<% } %><% } %>])
        .pipe(gulp.dest('<%= paths.tmp %>/static'));
});

/**
 * Processes all CSS files if preprocessed CSS languages are used (i.e. Stylus, Sass). Copies the processed
 * files to a temporary directory to be iterated on in subsequent tasks. If --debug is specified, minification
 * will be skipped.
 *
 * @param {Boolean} --debug     Specifies debug environment, skipping CSS compression.
 * @param {Boolean} --skip-csso Skips CSS compression.
 */
gulp.task('styles', function()
{
    return merge
    (
        gulp.src('<%= paths.src %>/static/css/**/*.'+STYLES_PATTERN)
            .pipe($.if(debug(), $.sourcemaps.init()))<% if (css == 'Stylus') { %>
            .pipe($.stylus({
                'include css': true
            }).on('error', $.util.log))<% } else if (css == 'Sass') { %>
            .pipe($.sass({
                outputStyle: 'nested',
                precision: 10,
                includePaths: ['.'],
                onError: console.error.bind(console, 'Sass error:')
            }))<% } %>
            .pipe($.postcss([require('autoprefixer-core')({ browsers: ['last 2 version', 'ie 9'] })]))
            .pipe($.if(debug(), $.sourcemaps.write()))
            .pipe($.if(!skipCSSO(), $.csso()))
            .pipe(gulp.dest('<%= paths.tmp %>/static/css')),
        gulp.src(['<%= paths.src %>/static/vendor/**/*.css'])
            .pipe($.concat('vendor.css'))
            .pipe($.if(!skipCSSO(), $.csso()))
            .pipe(gulp.dest('<%= paths.tmp %>/static/vendor'))
    );
});

/**
 * Processes and lints all JavaScript files. If Browserify is included this task will bundle up all associated files. Processed
 * JavaScript files are copied to a temporary directory to be iterated on in subsequent tasks. If --debug is specified, uglification
 * will be skipped.
 *
 * @param {Boolean} --debug         Specifies debug environment, skipping JavaScript compression.
 * @param {Boolean} --skip-uglify   Skips JavaScript compression.
 */
gulp.task('scripts', function()
{
    var browserify = require('browserify');
    var reactify = require('reactify');
    var through = require('through2');

    return merge
    (
        gulp.src(['./<%= paths.src %>/static/**/js/*.'+SCRIPTS_PATTERN]) // assuming all bundles reside in the js directory excluding sub-directories
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish'))
            .pipe(through.obj(function(file, enc, next)
            {
                browserify({ entries: [file.path], debug: true, transform: [reactify] })
                    .bundle(function(err, res)
                    {
                        if (err) console.log(err.toString());
                        file.contents = res;
                        next(null, file);
                    });
            }))
            .pipe($.if(debug(), $.sourcemaps.init({ loadMaps: true })))
            .pipe($.if(!skipUglify(), $.uglify())).on('error', $.util.log)
            .pipe($.if(debug(), $.sourcemaps.write('./')))
            .pipe(gulp.dest('<%= paths.tmp %>/static')),
        gulp.src(['<%= paths.src %>/static/vendor/**/*.'+SCRIPTS_PATTERN])
            .pipe($.concat('vendor.js'))
            .pipe($.if(!skipUglify(), $.uglify())).on('error', $.util.log)
            .pipe(gulp.dest('<%= paths.tmp %>/static/vendor'))
    );
});

/**
 * Deploys any other required file types to the temporary directory to be iterated on in subsequent tasks.
 */
gulp.task('extras', function()
{
    return gulp.src(['<%= paths.src %>/static/**/*.'+EXTRAS_PATTERN], { dot: true })
        .pipe(gulp.dest('<%= paths.tmp %>/static'));
});

/**
 * Processes all static files (i.e. images, fonts, stylesheets, scripts, etc) and deploys them to the build
 * directory.
 *
 * @param {Boolean} --debug Specifies debug environment for immediate and child tasks, skipping revisioning and
 *                          subsequent asset compressions.
 */
gulp.task('static', ['images', 'videos', 'fonts', 'styles', 'scripts', 'extras'], function(callback)
{
    if (debug())
    {
        gulp.src(['<%= paths.tmp %>/static/**/*'], { dot: true })
            .pipe(gulp.dest('<%= paths.build %>/static'));

        callback();
    }
    else
    {
        spawn('python', ['<%= paths.src %>/manage.py', 'collectstatic', '--noinput'], { stdio: 'inherit' }).on('exit', function(code)
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

/**
 * Processes all template files (i.e. HTML, etc) and deploys them to the temporary directory.
 *
 * @param {Boolean} --debug             Specifies debug environment, skipping HTML compression.
 * @param {Boolean} --skip-minify-html  Skips HTML compression.
 */
gulp.task('templates', function()
{
    return gulp.src(['<%= paths.src %>/templates/**/*.'+TEMPLATES_PATTERN, '<%= paths.src %>/templates/robots.txt'])
        .pipe($.if(!skipMinifyHTML(), $.minifyHtml({empty: true, conditionals: true, loose: true })))
        .pipe(gulp.dest('<%= paths.build %>/templates'));
});

/**
 * Cleans the build directory.
 */
gulp.task('clean', function(callback)
{
    require('del')(['<%= paths.tmp %>', '<%= paths.build %>'], function()
    {
        $.cache.clearAll(callback);
    });
});

/**
 * Builds the project including static files and templates and deploys the
 * entire project to the build directory. Note that in production environment
 * 'collectstatic' must be invoked in manage.py to complete deployment.
 *
 * @param {Boolean} --debug Specifies debug environment, skipping all sorts of static file compression.
 */
gulp.task('build', function(callback)
{
    if (debug())
    {
        sequence('templates', 'static', 'deploy', callback);
    }
    else
    {
        sequence('templates', 'static', 'deploy', callback);
    }
});

/**
 * Deploys project files to the build directory (excluding static and template files).
 */
gulp.task('deploy', function()
{
    return gulp.src(['<%= paths.src %>/**/*', '!<%= paths.src %>/{static,templates}/**/*'])
        .pipe(gulp.dest('<%= paths.build %>'));
});

/**
 * Runs Django project shell.
 */
gulp.task('shell', function()
{
    spawn('python', ['app/manage.py', 'shell'], { stdio: 'inherit' });
});

/**
 * Runs Django migration.
 */
gulp.task('migrate', function()
{
    spawn('python', ['app/manage.py', 'migrate'], { stdio: 'inherit' });
});

/**
 * Serves project to localhost. If --debug is specified, files will be served from
 * the temporary directory (with loose files) instead of the build directory.
 *
 * @param {Boolean} --debug Serve files from the staging directory (loose files), defaults
 *                          to false (serve from production directory).
 * @param {Number}  --port  Optional port number (defaults to 8080).
 */
gulp.task('serve', function()
{
    var port = $.util.env['port'] || $.util.env['p'];
    var baseDir = (debug()) ? '<%= paths.tmp %>' : '<%= paths.build %>';
    var browserSync = require('browser-sync');

    port = (typeof port === 'number') ? port : 8080;

    if (debug())
    {
        spawn('python', ['app/manage.py', 'runserver', '0.0.0.0:'+port, '--insecure'], { stdio: 'inherit' });
    }
    else
    {
        spawn('python', ['build/manage.py', 'runserver', '0.0.0.0:'+port, '--insecure', '--settings=project.settings.prod'], { stdio: 'inherit' });
    }

    browserSync(
    {
        notify: false,
        proxy: '0.0.0.0:'+port
    });

    if (debug())
    {
        gulp.watch('<%= paths.src %>/**/*.'+IMAGES_PATTERN, function() { sequence('images', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+VIDEOS_PATTERN, function() { sequence('videos', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+STYLES_PATTERN, function() { sequence('styles', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+SCRIPTS_PATTERN, function() { sequence('scripts', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+FONTS_PATTERN, function() { sequence('fonts', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+TEMPLATES_PATTERN, function() { sequence('templates', browserSync.reload); });
    }
    else
    {
        gulp.watch('<%= paths.src %>/**/*.'+IMAGES_PATTERN, function() { sequence('build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+VIDEOS_PATTERN, function() { sequence('build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+STYLES_PATTERN, function() { sequence('build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+SCRIPTS_PATTERN, function() { sequence('build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+FONTS_PATTERN, function() { sequence('build', browserSync.reload); });
        gulp.watch('<%= paths.src %>/**/*.'+TEMPLATES_PATTERN, function() { sequence('build', browserSync.reload); });
    }
});

/**
 * Default task. Cleans the generated directories and builds the project.
 *
 * @param {Boolean} --debug Specifies debug environment, meaning all sub-tasks will be
 *                          iterated in this environment.
 * @param {Boolean} --serve Specifies whether the site should be served at the end of
 *                          this task.
 */
gulp.task('default', function(callback)
{
    var serve = $.util.env['serve'] || $.util.env['s'];

    var seq = ['clean', 'build'];
    if (serve) seq.push('serve');
    seq.push(callback);

    sequence.apply(null, seq);
});
