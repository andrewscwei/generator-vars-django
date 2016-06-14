<% if (appauthor !== '') { %>// (c) <%= appauthor %>
<% } %>

const browserSync = require('browser-sync');
const config = require('./.taskconfig');
const gulp = require('gulp');
const path = require('path');
const sequence = require('run-sequence');
const spawn = require('child_process').spawn;
const $util = require('gulp-util');

/**
 * Serves the app locally. In production, watch option is not supported. This is
 * meant for development only.
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
    let entries = config.watch.entries;

    for (let i = 0; i < entries.length; i++) {
      let entry = entries[i];
      gulp.watch(entry.files, function() { sequence.apply(null, entry.tasks.concat(browserSync.reload)); });
    }
  }
});
