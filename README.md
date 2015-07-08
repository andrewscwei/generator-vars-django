# generator-vars-django

VARIANTE's Yeoman generator for a raw Django web app.

## Features

- [Django 1.7](https://www.djangoproject.com)
- [Gulp](http://gulpjs.com) setup for compression/minification of static files (i.e. images, CSS, JavaScripts) and templates (i.e. HTML), dev/prod deployment and various handy manage.py shortcuts
- [BrowserSync](http://www.browsersync.io) for rapid development
- [Browserify](http://browserify.org)
- [Babel](https://babeljs.io) for coding in ES6 standards
- Watchify for quick Browserify rebundling
- [Sass](http://sass-lang.com)/[Stylus](https://learnboost.github.io/stylus/) with Scalable and Modular Architecture (SMACSS) setup
- Choice from 3 database types: SQLite/MySQL/PostgreSQL
- [uWSGI](https://uwsgi-docs.readthedocs.org/en/latest/) and [Nginx](http://wiki.nginx.org/Main) configurations

## Libraries

- Bootstrap (optional)
- jQuery (optional)

For [Modernizr](http://modernizr.com), manually configure your custom build and put it in ```app/static/vendor``` folder, then include ```{% static 'vendor/vendor.js' %}``` in your HTML.

## Structure

```
.
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
|   |   +-- img
|   |   +-- js
|   |   |   +-- main.js
|   |   +-- css
|   |   |   +-- base
|   |   |   +-- components
|   |   |   +-- modules
|   |   |   +-- main.{scss/styl}
|   |   +-- vendor // vendor css/js files go here
|   |   +-- apple-touch-icon-57x57.png
|   |   +-- apple-touch-icon-72x72.png
|   |   +-- apple-touch-icon-114x114.png
|   |   +-- apple-touch-icon.png
|   |   +-- favico.ico
|   |   +-- favico.png
|   |   +-- og-image.png
|   +-- templates
|   |   +-- base.html
|   |   +-- index.html
|   |   +-- robots.txt
|   +-- manage.py
+-- build // runtime files go here
+-- node_modules
+-- tasks
|   +-- build.js
|   +-- clean.js
|   +-- config.js
|   +-- deploy.js
|   +-- extras.js
|   +-- fonts.js
|   +-- images.js
|   +-- migrate.js
|   +-- scripts.js
|   +-- serve.js
|   +-- shell.js
|   +-- static.js
|   +-- styles.js
|   +-- templates.js
|   +-- videos.js
+-- .buildpacks
+-- .editorconfig
+-- .gitattributes
+-- .gitignore
+-- .jshintrc
+-- gulpfile.js
+-- package.json
+-- project_name_nginx.conf
+-- project_name_uwsgi.ini
+-- README.md
+-- requirements.txt
+-- uwsgi_params
```

## Tasks

### ```gulp```

```gulp --debug```: Builds all static and template files in the ```app``` directory but skips all compression tasks. Built files are stored in the ```.tmp``` directory.

```gulp```: Builds all static and template fies in the ```app``` directory with asset compression such as CSS/HTML/JavaScript minification and deploys them to the ```build``` directory.

```gulp serve --debug --watch```: Serves the project in dev environment, begins watching files and automatically rebuilds and reloads browser when file changes are detected. It is recommended to use this environment during development to minimize build time.

```gulp serve```: Serves the project in prod environment.

See ```gulpfile.js``` for more tasks and custom flags such as ```--skip-uglify```, ```--skip-csso```, etc.


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

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
