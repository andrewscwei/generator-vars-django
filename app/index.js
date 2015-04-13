/**
 *  generator-vars-webapp
 *  (c) VARIANTE <http://variante.io>
 *
 *  This software is released under the MIT License:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

// Import dependencies.
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

/**
 * @module
 * Extend base Yeoman generator.
 */
module.exports = yeoman.generators.Base.extend({

/**
 * Constructor.
 */
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

/**
 * Initializes the generator instance and sets up all instance properties.
 */
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

/**
 * Displays welcome message.
 */
welcoming: function()
{
    var done = this.async();

    if (!this.options['skip-welcome-message'])
    {
        this.log(yosay('\'Allo \'allo! Out of the box I include Browserify and jQuery as well as Gulp to build your Django app.'));
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

/**
 * Prompts the user to pick preferred database engine.
 */
prompting1: function()
{
    var done = this.async();

    var prompts =
    [
        {
            type: 'checkbox',
            name: 'features',
            message: 'What database engine do you prefer? (select 1)',
            choices:
            [
                {
                    name: 'SQLite',
                    value: 'includeSQLite',
                    checked: true
                },
                {
                    name: 'MySQL',
                    value: 'includeMySQL',
                    checked: false
                },
                {
                    name: 'PostgreSQL',
                    value: 'includePostgreSQL',
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

        var count = 0;

        this.includeSQLite = hasFeature('includeSQLite'); count += (this.includeSQLite) ? 1 : 0;
        this.includeMySQL = hasFeature('includeMySQL'); count += (this.includeMySQL) ? 1 : 0;
        this.includePostgreSQL = hasFeature('includePostgreSQL'); count += (this.includePostgreSQL) ? 1 : 0;

        if (count !== 1)
        {
            this.env.error('Please select exactly 1 database engine.');
        }
        else
        {
            done();
        }
    }.bind(this));
},

/**
 * Prompts the user to decide preferred preprocessed CSS language.
 */
prompting2: function()
{
    var done = this.async();

    var prompts =
    [
        {
            type: 'checkbox',
            name: 'features',
            message: 'Which preprocessed CSS language do you prefer? (select exactly 1)',
            choices:
            [
                {
                    name: 'Sass',
                    value: 'includeSass',
                    checked: true
                },
                {
                    name: 'Stylus',
                    value: 'includeStylus',
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

        this.includeStylus = hasFeature('includeStylus');
        this.includeSass = hasFeature('includeSass');

        if (this.includeStylus === this.includeSass)
        {
            this.env.error('Please select either Stylus or Sass.');
        }
        else
        {
            done();
        }
    }.bind(this));
},

/**
 * Prompts the user for other preferred features.
 */
prompting3: function()
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
                    name: 'Modernizr',
                    value: 'includeModernizr',
                    checked: true
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
        this.includeModernizr = hasFeature('includeModernizr');
        this.includeSublime = hasFeature('includeSublime');

        done();
    }.bind(this));
},

/**
 * Writes project files to destination.
 */
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
     * Generates Bower config files.
     */
    bower: function()
    {
        this.copy('bowerrc', '.bowerrc');
        this.copy('bower.json', 'bower.json');
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

        if (this.includeStylus)
        {
            ext += 'styl';
        }
        else if (this.includeSass)
        {
            ext += 'scss';
        }
        else
        {
            ext += 'css';
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
        if (this.includeSass || this.includeStylus) this.template('app/static/css/main'+ext, this.paths.src+'/static/css/main'+ext);

        this.mkdir(this.paths.src+'/static/css/base');
        this.template('app/static/css/base/normalize'+ext, this.paths.src+'/static/css/base/normalize'+ext);
        this.template('app/static/css/base/typography'+ext, this.paths.src+'/static/css/base/typography'+ext);
        this.template('app/static/css/base/layout'+ext, this.paths.src+'/static/css/base/layout'+ext);

        this.mkdir(this.paths.src+'/static/css/components');
        this.mkdir(this.paths.src+'/static/css/modules');

        this.mkdir(this.paths.src+'/static/js');
        this.template('app/static/js/main.js', this.paths.src+'/static/js/main.js');

        this.mkdir(this.paths.src+'/static/img');

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

/**
 * Performs npm/bower installations.
 */
install: function()
{
    if (this.options['skip-install'])
    {
        var howToInstall = '\nI\'m all done. Follow the rest of the instructions in '+chalk.green.bold('README.md') + ' and you should be all set!';
        this.log(howToInstall);

        return;
    }

    // Install npm/bower dependencies.
    this.installDependencies(
    {
        skipMessage: this.options['skip-install-message'],
        skipInstall: this.options['skip-install']
    });

    // Install pip dependencies if virtualenv is enabled.
    if (process.env.VIRTUAL_ENV)
    {
        this.log('\nInstalling pip dependencies...');
        this.spawnCommand('pip', ['install', '-r', 'requirements.txt']);

        // Add environment variables to virtualenv.
        var envs = this.readFileAsString(this.destinationPath('.environment')).replace(/(^#.+$)/gm, '').replace(/(^\n)/gm, '');
        var file = this.destinationPath('bin/activate');
        var venv = this.readFileAsString(file) + '\n' + envs;

        this.writeFileFromString(venv, file);
    }
    else
    {
        this.log('\nPlease activate your virtualenv and manually install pip dependencies with ' + chalk.yellow.bold('pip install -r requirements.txt') + '.');
    }

    this.on('end', function()
    {
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
    }.bind(this));
}

});
