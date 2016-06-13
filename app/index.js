// (c) Andrew Wei

'use strict';

const _ = require('underscore.string');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const yeoman = require('yeoman-generator');
const yosay = require('yosay');

module.exports = yeoman.Base.extend({
  constructor: function() {
    yeoman.Base.apply(this, arguments);

    this.argument('projectname', {
      type: String,
      required: false
    });

    this.appname = _.slugify(this.projectname || this.appname);

    this.option('skip-install', {
      desc: 'Skips the installation of dependencies',
      type: Boolean
    });
  },

  initializing: function() {
    this.pkg = require('../package.json');
    this.secretKey = require('crypto').randomBytes(Math.ceil(50 * 3 / 4)).toString('base64');
    this.paths = {
      src: 'app',
      build: 'build',
      tmp: '.tmp'
    };
  },

  prompting: {
    welcome: function() {
      let done = this.async();

      this.log(yosay('\'Allo \'allo! Out of the box I include Browserify as well as Gulp to build your Django app.'));

      if (!process.env.VIRTUAL_ENV) {
        this.log(chalk.yellow('\nWARNING: ') + 'You are not in a Python virtual environment. Please activate your Python environment before using this generator.');
        return;
      }

      let prompts = [{
        type: 'input',
        name: 'appauthor',
        message: 'Who is the author? (this will appear in the header of your source files)'
      }];

      this.prompt(prompts, (answers) => {
        this.appauthor = answers.appauthor;
        done();
      });
    },

    database: function() {
      let done = this.async();

      let prompts = [{
        type: 'list',
        name: 'database',
        message: 'Which database engine do you prefer?',
        choices: [{
          name: 'SQLite',
          value: 'SQLite'
        }, {
          name: 'MySQL',
          value: 'MySQL'
        }, {
          name: 'PostgreSQL',
          value: 'PostgreSQL'
        }]
      }];

      this.prompt(prompts, (answers) => {
        this.database = answers.database;
        done();
      });
    },

    css: function() {
      let done = this.async();

      let prompts = [{
        type: 'list',
        name: 'css',
        message: 'Which preprocessed CSS language do you prefer?',
        choices: [{
          name: 'Sass',
          value: 'Sass'
        }, {
          name: 'Stylus',
          value: 'Stylus'
        }]
      }];

      this.prompt(prompts, (answers) => {
        this.css = answers.css;
        done();
      });
    }
  },

  writing: function() {
    let files = this.expandFiles('**', { dot: true, cwd: this.sourceRoot() });

    for (let i = 0; i < files.length; i++) {
      let f = files[i];
      let src = path.join(this.sourceRoot(), f);
      let basename = path.basename(f);

      switch (basename) {
        case '.DS_Store':
          // Do nothing
          break;
        case 'uwsgi.ini':
        case 'nginx.conf':
          this.template(src, path.join(path.dirname(f), `${this.appname}_${basename}`));
          break;
        case 'application.css':
          if (this.css === 'Sass')
            this.template(src, path.join(path.dirname(f), `application.scss`));
          else if (this.css === 'Stylus')
            this.template(src, path.join(path.dirname(f), `application.styl`));
          else
            this.template(src, path.join(path.dirname(f), `application.css`));
          break;
        case 'gitignore':
        case 'secrets':
          this.template(src, path.join(path.dirname(f), `.${basename}`));
          break;
        default:
          if (~['.png', '.jpg', '.ico'].indexOf(path.extname(basename)))
            this.copy(src, path.join(path.dirname(f), basename));
          else
            this.template(src, path.join(path.dirname(f), basename));
      }
    }
  },

  install: {
    pip: function() {
      let done = this.async();

      if (this.options['skip-install']) {
        this.log('Skipping pip dependency installation. You will have to manually run ' + chalk.yellow.bold('pip install -r requirements.txt') + '.');
        done();
      } else {
        if (process.env.VIRTUAL_ENV) {
          this.log(chalk.magenta('Installing pip dependencies...'));
          this.spawnCommand('pip', ['install', '-r', 'requirements.txt']).on('exit', function() {
            // Add environment variables to virtualenv.
            let envs = this.readFileAsString(this.destinationPath('.secrets')).replace(/(^#.+$)/gm, '').replace(/(^\n)/gm, '');
            let file = path.join(process.env.VIRTUAL_ENV, 'bin/activate');
            let venv = this.readFileAsString(file) + '\n' + envs;

            this.writeFileFromString(venv, file);

            done();
          }.bind(this));
        } else {
          this.log(chalk.red('Pip dependencies are not installed because there is no virtualenv detected. Please create/activate your virtualenv and manually install pip dependencies with ') + chalk.yellow.bold('pip install -r requirements.txt') + '.');
          done();
        }
      }
    },

    npm: function() {
      if (this.options['skip-install']) {
        this.log('Skipping node dependency installation. You will have to manually run ' + chalk.yellow.bold('npm install') + '.');
      } else {
        this.log(chalk.magenta('Installing node modules for you using your ') + chalk.yellow.bold('package.json') + chalk.magenta('...'));

        this.installDependencies({
          skipMessage: true,
          bower: false
        });
      }
    }
  },

  end: function() {
    this.log(chalk.green('Finished generating app! Reactivate your virtual environment to load the new environment variables.'));
  }
});
