#generator-vars-django
VARIANTE's Yeoman generator for a raw Django web app.

##Features
- Django 1.7
- ```node```
- ```bower```
- ```gulp``` setup for compression/minification of static files (i.e. images, CSS, JavaScripts, etc) and tempaltes (i.e. HTML)
- ```fabric``` setup for dev/prod deployment and various handy manage.py shortcuts
- Choice from 3 database types: SQLite/MySQL/PostgreSQL
- Scalable and Modular Architecture for CSS (SMACSS) setup with Sass/Stylus
- Browserify
- uWSGI and Nginx configurations
- Sublime project (optional)

##Libraries
- Bootstrap (optional)
- Modernizr (optional)
- jQuery

##Structure
```
.
+-- app
|   +-- project
|   |   +-- apps
|   |   |   +-- Django apps
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
|   +-- manage.py
+-- build
|   +-- runtime files
+-- bower_components
+-- node_modules
+-- .bowerrc
+-- .editorconfig
+-- .gitattributes
+-- .gitignore
+-- .jshintrc
+-- fabfile.py
+-- gulpfile.js
+-- bower.json
+-- package.json
+-- uwsgi_params
+-- project_name_nginx.conf
+-- project_name_uwsgi.ini
+-- requirements.txt
+-- README.md
```

##Tasks
###```gulp```
```gulp build --debug```: Builds all static and template files in the ```app``` directory but skips all compression tasks. Built files are stored in the ```.tmp``` directory.

```gulp build```: Builds all static and template fies in the ```app``` directory with asset compression such as CSS/HTML/JavaScript minification and deploys them to the ```build``` directory.

See ```gulpfile.js``` for more tasks and custom flags such as ```--skip-uglify```, ```--skip-csso```, etc.

###```fabric```
```fab build:dev```: Builds and deploys static and template files to the ```.tmp``` directory so they are ready to be served using dev settings.

```fab build```: Builds and deploys static, template, and project files to the ```build``` directory so they are ready to be served using prod settings.

```fab serve:dev```: Serves the project in dev environment.

```fab serve```: Serves the project in prod environment.

See ```fabfile.py``` for more tasks.

##Usage
Install ```yo```
```
npm install -g yo
```

Install ```generator-vars-django```
```
npm install -g generator-vars-django
```

Create a new directory for your project and ```cd``` into it
```
mkdir new-project-name && cd $_
```

Generate the project
```
yo vars-django
```

For details on initial setup procedures of the project, see its generated README.md file.

##License
This software is released under the [MIT License](http://opensource.org/licenses/MIT).
