# generator-vars-django

VARIANTE's Yeoman generator for a raw Django web app.

## Features

- Django 1.7
- ```bower```
- ```gulp``` setup for compression/minification of static files (i.e. images, CSS, JavaScripts) and templates (i.e. HTML), dev/prod deployment and various handy manage.py shortcuts
- ```browser-sync``` and ```gulp-watch``` working with Django's ```runserver```
- Browserify
- Scalable and Modular Architecture for CSS (SMACSS) setup with Sass/Stylus
- Choice from 3 database types: SQLite/MySQL/PostgreSQL
- uWSGI and Nginx configurations
- Sublime project (optional)

## Libraries

- Bootstrap (optional)
- Modernizr (optional)
- jQuery

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
+-- bower_components
+-- node_modules
+-- .bowerrc
+-- .editorconfig
+-- .gitattributes
+-- .gitignore
+-- .jshintrc
+-- gulpfile.js
+-- bower.json
+-- package.json
+-- uwsgi_params
+-- project_name_nginx.conf
+-- project_name_uwsgi.ini
+-- requirements.txt
+-- README.md
```

## Tasks

### ```gulp```

```gulp build --debug```: Builds all static and template files in the ```app``` directory but skips all compression tasks. Built files are stored in the ```.tmp``` directory.

```gulp build```: Builds all static and template fies in the ```app``` directory with asset compression such as CSS/HTML/JavaScript minification and deploys them to the ```build``` directory.

```gulp serve --debug```: Serves the project in dev environment, begins watching files and automatically rebuilds and reloads browser when file changes are detected. It is recommended to use this environment during development to minimize build time.

```gulp serve```: Serves the project in prod environment, begins watching files and automatically rebuilds (fully) and reloads browser when file changes are detected.

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
virtualenv . && source bin/activate
```

Generate the project:
```
yo vars-django [app-name]
```

For details on initial setup procedures of the project, see its generated ```README.md``` file.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
