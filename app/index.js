/**
 *  generator-vars-django
 *  (c) VARIANTE <http://variante.io>
 *
 *  This software is released under the MIT License:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend
(
    {
        constructor: function()
        {
            yeoman.generators.Base.apply(this, arguments);

            this.argument('projectname', { type: String, required: false });
            this.appname = this.projectname || this.appname;

            this.option('test-framework',
            {
                desc: 'Test framework to be invoked',
                type: String,
                defaults: 'mocha'
            });

            this.option('skip-welcome-message',
            {
                desc: 'Skips the welcome message',
                type: Boolean
            });

            this.option('skip-install',
            {
                desc: 'Skips the installation of dependencies',
                type: Boolean
            });
        },

        initializing: function()
        {
            this.pkg = require('../package.json');
            this.secretKey = require('crypto').randomBytes(Math.ceil(50 * 3 / 4)).toString('base64');
            this.paths =
            {
                src: 'app',
                build: 'build',
                tmp: '.tmp'
            };
        },

        prompting:
        {
            welcome: function()
            {
                var done = this.async();

                if (!this.options['skip-welcome-message'])
                {
                    this.log(yosay('\'Allo \'allo! Out of the box I include Browserify as well as Gulp to build your Django app.'));
                }

                if (!process.env.VIRTUAL_ENV)
                {
                    this.log(chalk.yellow('\nWARNING: ') + 'You are not in a Python virtual environment. Please activate your Python environment before using this generator.');
                    return;
                }

                var prompts =
                [
                    {
                        type: 'input',
                        name: 'appauthor',
                        message: 'Who is the author? (this will appear in the header of your source files)'
                    },
                    {
                        type: 'input',
                        name: 'appauthoremail',
                        message: 'What is your email? (this will appear in the header of your source files)'
                    }
                ];

                this.prompt(prompts, function(answers)
                {
                    this.appauthor = answers.appauthor;
                    this.appauthoremail = answers.appauthoremail;

                    done();
                }.bind(this));
            },

            database: function()
            {
                var done = this.async();

                var prompts =
                [
                    {
                        type: 'list',
                        name: 'database',
                        message: 'Which database engine do you prefer?',
                        choices:
                        [
                            {
                                name: 'SQLite',
                                value: 'SQLite'
                            },
                            {
                                name: 'MySQL',
                                value: 'MySQL'
                            },
                            {
                                name: 'PostgreSQL',
                                value: 'PostgreSQL'
                            }
                        ]
                    }
                ];

                this.prompt(prompts, function(answers)
                {
                    this.database = answers.database;

                    done();
                }.bind(this));
            },

            css: function()
            {
                var done = this.async();

                var prompts =
                [
                    {
                        type: 'list',
                        name: 'css',
                        message: 'Which preprocessed CSS language do you prefer?',
                        choices:
                        [
                            {
                                name: 'Sass',
                                value: 'Sass'
                            },
                            {
                                name: 'Stylus',
                                value: 'Stylus'
                            }
                        ]
                    }
                ];

                this.prompt(prompts, function(answers)
                {
                    this.css = answers.css;

                    done();
                }.bind(this));
            },

            features: function()
            {
                var done = this.async();

                var prompts =
                [
                    {
                        type: 'checkbox',
                        name: 'features',
                        message: 'What more would you like?',
                        choices:
                        [
                            {
                                name: 'Bootstrap',
                                value: 'includeBootstrap',
                                checked: false
                            },
                            {
                                name: 'jQuery',
                                value: 'includejQuery',
                                checked: false
                            }
                        ]
                    }
                ];

                this.prompt(prompts, function(answers)
                {
                    var features = answers.features;

                    var hasFeature = function(feat)
                    {
                        return features.indexOf(feat) !== -1;
                    };

                    this.includeBootstrap = hasFeature('includeBootstrap');
                    this.includejQuery = hasFeature('includejQuery');

                    done();
                }.bind(this));
            }
        },

        writing:
        {
            config: function()
            {
                this.copy('buildpacks', '.buildpacks');
                this.copy('gitignore', '.gitignore');
                this.copy('gitattributes', '.gitattributes');
                this.copy('requirements.txt', 'requirements.txt');
                this.copy('jshintrc', '.jshintrc');
                this.copy('editorconfig', '.editorconfig');
                this.copy('README.md', 'README.md');

                this.template('gulpfile.js');
                this.template('tasks/build.js');
                this.template('tasks/clean.js');
                this.template('tasks/config.js');
                this.template('tasks/deploy.js');
                this.template('tasks/extras.js');
                this.template('tasks/fonts.js');
                this.template('tasks/images.js');
                this.template('tasks/migrate.js');
                this.template('tasks/scripts.js');
                this.template('tasks/serve.js');
                this.template('tasks/shell.js');
                this.template('tasks/static.js');
                this.template('tasks/styles.js');
                this.template('tasks/templates.js');
                this.template('tasks/videos.js');
                this.template('package.json', 'package.json');
                this.template('environment', '.environment');
                this.template('uwsgi_params', 'uwsgi_params');
                this.template('uwsgi.ini', this.appname+'_uwsgi.ini');
                this.template('nginx.conf', this.appname+'_nginx.conf');
            },

            app: function()
            {
                var ext = '.';

                switch (this.css)
                {
                    case 'Sass': ext += 'scss'; break;
                    case 'Stylus': ext += 'styl'; break;
                    default: ext += 'css'; break;
                }

                this.mkdir(this.paths.src);
                this.template('app/manage.py', this.paths.src+'/manage.py');

                this.mkdir(this.paths.src+'/project');
                this.copy('app/project/__init__.py', this.paths.src+'/project/__init__.py');
                this.template('app/project/urls.py', this.paths.src+'/project/urls.py');
                this.template('app/project/views.py', this.paths.src+'/project/views.py');
                this.template('app/project/wsgi.py', this.paths.src+'/project/wsgi.py');

                this.mkdir(this.paths.src+'/project/apps');
                this.copy('app/project/apps/__init__.py', this.paths.src+'/project/apps/__init__.py');

                this.mkdir(this.paths.src+'/project/settings');
                this.copy('app/project/settings/__init__.py', this.paths.src+'/project/settings/__init__.py');
                this.template('app/project/settings/base.py', this.paths.src+'/project/settings/base.py');
                this.template('app/project/settings/dev.py', this.paths.src+'/project/settings/dev.py');
                this.template('app/project/settings/prod.py', this.paths.src+'/project/settings/prod.py');

                this.mkdir(this.paths.src+'/static');
                this.copy('app/static/apple-touch-icon-114x114.png', this.paths.src+'/static/apple-touch-icon-114x114.png');
                this.copy('app/static/apple-touch-icon-57x57.png', this.paths.src+'/static/apple-touch-icon-57x57.png');
                this.copy('app/static/apple-touch-icon-72x72.png', this.paths.src+'/static/apple-touch-icon-72x72.png');
                this.copy('app/static/apple-touch-icon.png', this.paths.src+'/static/apple-touch-icon.png');
                this.copy('app/static/favicon.ico', this.paths.src+'/static/favicon.ico');
                this.copy('app/static/favicon.png', this.paths.src+'/static/favicon.png');
                this.copy('app/static/og-image.png', this.paths.src+'/static/og-image.png');

                this.mkdir(this.paths.src+'/static/css');
                this.template('app/static/css/main'+ext, this.paths.src+'/static/css/main'+ext);

                this.mkdir(this.paths.src+'/static/css/base');
                this.template('app/static/css/base/normalize'+ext, this.paths.src+'/static/css/base/normalize'+ext);
                this.template('app/static/css/base/typography'+ext, this.paths.src+'/static/css/base/typography'+ext);
                this.template('app/static/css/base/layout'+ext, this.paths.src+'/static/css/base/layout'+ext);

                this.mkdir(this.paths.src+'/static/css/components');
                this.mkdir(this.paths.src+'/static/css/modules');

                this.mkdir(this.paths.src+'/static/js');
                this.template('app/static/js/main.js', this.paths.src+'/static/js/main.js');

                this.mkdir(this.paths.src+'/static/img');
                this.mkdir(this.paths.src+'/static/vendor');

                this.mkdir(this.paths.src+'/templates');
                this.template('app/templates/robots.txt', this.paths.src+'/templates/robots.txt');
                this.template('app/templates/base.html', this.paths.src+'/templates/base.html');
                this.template('app/templates/index.html', this.paths.src+'/templates/index.html');
            },

            templates: function()
            {
                this.indexFile = this.readFileAsString(this.templatePath('app/templates/base.html'));
                this.indexFile = this.engine(this.indexFile, this);
                this.indexFile = this.appendFiles
                (
                    {
                        html: this.indexFile,
                        fileType: 'js',
                        optimizedPath: 'js/main.js',
                        sourceFileList: ['js/main.js']
                    }
                );
            },

            test: function()
            {
                this.composeWith(this.options['test-framework'] + ':app',
                {
                    options:
                    {
                        'skip-install': this.options['skip-install']
                    }
                },
                {
                    local: require.resolve('generator-mocha/generators/app/index.js')
                });
            }
        },

        install:
        {
            pip: function()
            {
                var done = this.async();

                if (this.options['skip-install'])
                {
                    this.log('Skipping pip dependency installation. You will have to manually run ' + chalk.yellow.bold('pip install -r requirements.txt') + '.');
                    done();
                }
                else
                {
                    if (process.env.VIRTUAL_ENV)
                    {
                        this.log(chalk.magenta('Installing pip dependencies...'));
                        this.spawnCommand('pip', ['install', '-r', 'requirements.txt']).on('exit', function()
                        {
                            // Add environment variables to virtualenv.
                            var envs = this.readFileAsString(this.destinationPath('.environment')).replace(/(^#.+$)/gm, '').replace(/(^\n)/gm, '');
                            var file = this.destinationPath('bin/activate');
                            var venv = this.readFileAsString(file) + '\n' + envs;

                            this.writeFileFromString(venv, file);

                            done();
                        }.bind(this));
                    }
                    else
                    {
                        this.log(chalk.red('Pip dependencies are not installed because there is no virtualenv detected. Please create/activate your virtualenv and manually install pip dependencies with ') + chalk.yellow.bold('pip install -r requirements.txt') + '.');
                        done();
                    }
                }
            },

            npm: function()
            {
                if (this.options['skip-install'])
                {
                    this.log('Skipping node dependency installation. You will have to manually run ' + chalk.yellow.bold('npm install') + '.');
                }
                else
                {
                    this.log(chalk.magenta('Installing node modules for you using your ') + chalk.yellow.bold('package.json') + chalk.magenta('...'));

                    this.installDependencies({
                      skipMessage: true,
                      bower: false
                    });
                }
            }
        },

        end: function()
        {
            this.log(chalk.green('Finished generating app! Reactivate your virtual environment to load the new environment variables.'));
        }
    }
);
