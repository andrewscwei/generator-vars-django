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

            this.option('skip-install-message',
            {
                desc: 'Skips the message after the installation of dependencies',
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
                    this.log(chalk.yellow('\nWARNING: ') + 'You are not in a Python virtual environment. It is strongly recommended that you create one and activate it before running this generator.\n');
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
                            },
                            {
                                name: 'Sublime',
                                value: 'includeSublime',
                                checked: true
                            },
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
                    this.includeSublime = hasFeature('includeSublime');

                    done();
                }.bind(this));
            }
        },

        writing:
        {
            /**
             * Generates sublime project if feature is selected.
             */
            sublime: function()
            {
                if (this.includeSublime)
                {
                    this.template('sublime-project', this.appname + '.sublime-project');
                }
            },

            /**
             * Generates gulpfile.js.
             */
            gulpfile: function()
            {
                this.template('gulpfile.js');
            },

            /**
             * Generates package.json.
             * @return {[type]} [description]
             */
            package: function()
            {
                this.template('package.json', 'package.json');
            },

            /**
             * Generates Git repo config files.
             */
            git: function()
            {
                this.copy('gitignore', '.gitignore');
                this.copy('gitattributes', '.gitattributes');
            },

            /**
             * Generates pip dependency requirements.
             */
            pip: function()
            {
                this.copy('requirements.txt', 'requirements.txt');
            },

            /**
             * Generates .environment (stores environment variables, i.e. Django secret key).
             */
            bashProfile: function()
            {
                this.template('environment', '.environment');
            },

            /**
             * Generates uWSGI config files.
             */
            uwsgi: function()
            {
                this.template('uwsgi_params', 'uwsgi_params');
                this.template('uwsgi.ini', this.appname+'_uwsgi.ini');
            },

            /**
             * Generates Nginx config files.
             */
            nginx: function()
            {
                this.template('nginx.conf', this.appname+'_nginx.conf');
            },

            /**
             * Generates jshint config file.
             */
            jshint: function()
            {
                this.copy('jshintrc', '.jshintrc');
            },

            /**
             * Generates editor config file.
             */
            editorConfig: function()
            {
                this.copy('editorconfig', '.editorconfig');
            },

            readme: function()
            {
                this.copy('README.md', 'README.md');
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
            }
        },

        install:
        {
            pip: function()
            {
                var done = this.async();

                if (this.options['skip-install'])
                {
                    this.log('\nSkipping pip dependency installation. You will have to manually run ' + chalk.yellow.bold('pip install -r requirements.txt') + '.');
                    done();
                }

                if (process.env.VIRTUAL_ENV)
                {
                    this.log('\nInstalling pip dependencies...');
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
                    this.log('\n' + chalk.red('Pip dependencies are not installed because there is no virtualenv detected. Please create/activate your virtualenv and manually install pip dependencies with ') + chalk.yellow.bold('pip install -r requirements.txt') + '.');
                    done();
                }
            },

            npm: function()
            {
                var done = this.async();

                if (this.options['skip-install'])
                {
                    this.log('\nSkipping node dependency installation. You will have to manually run ' + chalk.yellow.bold('npm install') + '.');
                    done();
                }

                this.log('\nInstalling node modules for you using your ' + chalk.yellow.bold('package.json') + '...');
                this.spawnCommand('npm', ['install', '--ignore-scripts']).on('exit', function(code)
                {
                    if (code !== 0)
                    {
                        this.log('\n' + chalk.red('Installation failed. Please manually run ') + chalk.yellow.bold('npm install') + chalk.red('.'));
                    }

                    done();
                }.bind(this));
            }
        },

        end: function()
        {
            if (this.options['skip-install'])
            {
                this.log('\nI\'m all done. Follow the rest of the instructions in '+chalk.green.bold('README.md') + ' and you should be all set!');
                return;
            }

            // Ideally we should use composeWith, but we're invoking it here
            // because generator-mocha is changing the working directory
            // https://github.com/yeoman/generator-mocha/issues/28.
            this.invoke(this.options['test-framework'],
            {
                options:
                {
                    'skip-message': this.options['skip-install-message'],
                    'skip-install': this.options['skip-install']
                }
            });
        }
    }
);
