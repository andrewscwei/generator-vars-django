/* jshint strict:false */
/**
 *  <%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
 *  (c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>
 *
 *  This file only contains the default task. See ./tasks for individual sub-tasks. To add a new
 *  sub-task, simply create a new file in ./tasks and it will be automatically included here. For
 *  global config settings for Gulp tasks, see ./tasks/config.js.
 */
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

// Require all gulp tasks.
require('require-dir')('./tasks');

// Import packages.
var config = require('./tasks/config');
var gulp = require('gulp');
var sequence = require('run-sequence');

/**
 *  Default Gulp task. This is the task that gets executed when you run the shell command 'gulp'.
 *  This task will wipe the compiled files and rebuild everything, with on-complete options such
 *  as serving and watching files for changes.
 *
 *  @param {Boolean} debug
 *  @param {Boolean} skipImageMin
 *  @param {Boolean} skipCSSO
 *  @param {Boolean} skipUglify
 *  @param {Boolean} skipHTML
 *  @param {Boolean} serve
 *  @param {Number}  port
 *  @param {Boolean} watch
 */
gulp.task('default', function(callback)
{
    var seq = ['clean', 'build'];
    if (config.env.serve) seq.push('serve');
    seq.push(callback);

    sequence.apply(null, seq);
});
