# generator-vars-django [![Circle CI](https://circleci.com/gh/andrewscwei/generator-vars-django/tree/master.svg?style=svg)](https://circleci.com/gh/andrewscwei/generator-vars-django/tree/master) [![npm version](https://badge.fury.io/js/generator-vars-django.svg)](https://badge.fury.io/js/generator-vars-django)

Yeoman generator for a raw Django web app.

## Features

- [Django 1.9.6](https://www.djangoproject.com)
- [Gulp](http://gulpjs.com) setup for compression/minification of static files (i.e. images, CSS, JavaScripts) and templates (i.e. HTML), dev/prod deployment and various handy manage.py shortcuts
- [BrowserSync](http://www.browsersync.io) for rapid development
- [Browserify](http://browserify.org)
- [Babel](https://babeljs.io) for coding in ES6 standards
- Watchify for quick Browserify rebundling
- [Sass](http://sass-lang.com)/[Stylus](https://learnboost.github.io/stylus/) with Scalable and Modular Architecture (SMACSS) setup
- Choice from 3 database types: SQLite/MySQL/PostgreSQL
- [uWSGI](https://uwsgi-docs.readthedocs.org/en/latest/) and [Nginx](http://wiki.nginx.org/Main) configurations
- [H5BP favicon and app icon template](http://littlewebgiants.com/favicon-and-app-icon-template/)

## Structure

```
.
+-- .buildpacks
+-- .editorconfig
+-- .jshintrc
+-- .gitignore
+-- .secrets
+-- app
|   +-- project
|   |   +-- apps // Django apps go here
|   |   +-- settings
|   |   |   +-- base.py
|   |   |   +-- dev.py
|   |   |   +-- prod.py
|   |   +-- urls.py
|   |   +-- views.py
|   |   +-- wsgi.py
|   +-- static
|   |   +-- fonts
|   |   +-- images
|   |   +-- javascripts
|   |   |   +-- application.js
|   |   +-- stylesheets
|   |   |   +-- application.{scss/styl}
|   |   +-- vendor // vendor css/js files go here
|   |   +-- videos
|   |   +-- apple-touch-icon-180x180-precomposed.png
|   |   +-- apple-touch-icon-152x152-precomposed.png
|   |   +-- apple-touch-icon-144x144-precomposed.png
|   |   +-- apple-touch-icon-120x120-precomposed.png
|   |   +-- apple-touch-icon-114x114-precomposed.png
|   |   +-- apple-touch-icon-76x76-precomposed.png
|   |   +-- apple-touch-icon-72x72-precomposed.png
|   |   +-- apple-touch-icon-60x60-precomposed.png
|   |   +-- apple-touch-icon-57x57-precomposed.png
|   |   +-- apple-touch-icon-precomposed.png
|   |   +-- browserconfig.xml
|   |   +-- favicon.ico
|   |   +-- favicon.png
|   |   +-- large.png
|   |   +-- launcher-icon-0-75x.png
|   |   +-- launcher-icon-1-5x.png
|   |   +-- launcher-icon-1x.png
|   |   +-- launcher-icon-2x.png
|   |   +-- launcher-icon-3x.png
|   |   +-- launcher-icon-4x.png
|   |   +-- manifest.json
|   |   +-- og-image.png
|   |   +-- robots.txt
|   |   +-- square.png
|   |   +-- tiny.png
|   |   +-- wide.png
|   |   +-- templates
|   |   +-- base.html
|   |   +-- index.html
|   |   +-- robots.txt
|   +-- manage.py
+-- build // runtime files go here
+-- node_modules
+-- tasks
|   +-- .taskconfig
|   +-- build.js
|   +-- clean.js
|   +-- serve.js
+-- gulpfile.js
+-- package.json
+-- project_name_nginx.conf
+-- project_name_uwsgi.ini
+-- README.md
+-- requirements.txt
+-- uwsgi_params
```

## Tasks

```$ npm run dev```: Compiles all source files, serves the site and watches for file changes. Best used during development.

```$ npm run prod```: Builds the entire project in production.

All tasks are broken into micro Gulp tasks, check out the ```tasks``` folder for more details. Also see ```tasks/.taskconfig``` for more custom flags such as ```--skip-js-min```, ```--skip-css-min```, etc.


## Usage

Install ```yo```:
```
npm install -g yo
```

Install ```generator-vars-django```:
```
npm install -g generator-vars-django
```

Create a new directory for your project and ```cd``` into it:
```
mkdir new-project-name && cd $_
```

Create ```virtualenv``` and activate it:
```
virtualenv {path} && source {virtualenv_path}/bin/activate
```

Generate the project:
```
yo vars-django [app-name]
```

For details on initial setup procedures of the project, see its generated ```README.md``` file.

## Release Notes

### 2.1.0
1. Django 1.9.6
2. Python 3
3. Node >= 5.6.0

### 2.0.0
1. Updated version numbers of NPM package dependencies.
2. Gulp tasks are now compressed into fewer files. As a result `require-dir` dependency is no longer necessary and is removed from `package.json`.
3. Task configurations are now stored in `./tasks/.taskconfig`.
4. `favicon.png`, Apple touch and Open Graph specific icons are now moved to `app/static/img`. `favicon.ico` remains in the static directory root.
5. `gulp-imagemin` is removed because it is the most taxing task in the Gulp pipeline. Images should be optimized outside of the Gulp pipeline instead.
6. Removed `mocha`. It was never intended as a default test framework for a Django project. 
7. Minor syntactic sugar changes.
8. Lots of optimizations, particularly boosting the efficiency of automated rebuilds during development.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
