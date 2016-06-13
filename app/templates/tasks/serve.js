<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>

var browserSync = require('browser-sync');
var config = require('./.taskconfig');
var gulp = require('gulp');
var path = require('path');
var spawn = require('child_process').spawn;
var $util = require('gulp-util');

/**
 * Serves the app locally. In production, watch option is not supported. This is meant for
 * development only.
 *
 * @param {boolean} debug
 * @param {number}  port
 * @param {boolean} watch
 */
gulp.task('serve', function() {
  if (config.env.watch && !config.debug) {
    $util.log($util.colors.yellow('Watch is not supported in production. Please specify ') + '--debug' + $util.colors.yellow(' instead.'));
    return;
  }

  if (config.debug) {
    spawn('python', [path.join(config.paths.src, 'manage.py'), 'runserver', config.serve.browserSync.proxy, '--insecure'], { stdio: 'inherit' });
  }
  else {
    spawn('python', [path.join(config.paths.build, 'manage.py'), 'runserver', config.serve.browserSync.proxy, '--insecure', '--settings=project.settings.prod'], { stdio: 'inherit' });
  }

  browserSync(config.serve.browserSync);

  // Watch for changes.
  if (config.env.watch) {
    var entries = config.watch.entries;

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      gulp.watch(entry.files, entry.tasks);
    }
  }
});
