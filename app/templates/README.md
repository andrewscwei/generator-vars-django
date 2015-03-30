#<%= appname %>
This project is scaffolded by [Yeoman](http://yeoman.io). See [generator-vars-django](https://github.com/VARIANTE/generator-vars-django.git) for more details.

##Usage
Install node modules if they are not already installed:
```
$ npm install
```

Install bower components if they are not already installed:
```
$ bower install
```

If you are using Modernizr, and the following to its ```bower.json``` so ```main-bower-files``` can pick it up:
```
"main": "modernizr.js"
```

Initialize virtualenv:
```
$ virtualenv .
```

Add generated environment variables to ```./bin/activate```.

Activate virtualenv:
```
$ source bin/activate
```

Install pip dependencies using requirements.txt:
```
$ pip install -r requirements.txt
```

Verify pip dependencies installed correctly under virtualenv:
```
$ which django-admin.py
```

Configure PostgreSQL if needed:
```
$ sudo su - postgres
$ createuser --interactive -P
$ createdb --owner username dbname
```

Configure MySQL if needed:
```
$ mysql_secure_installation
$ mysql --user=root --password={password}
$ mysql> create database {db_name};
$ mysql> quit;
```

Apply initial migration:
```
$ fab migrate
```

Test dev environment. You should see "Hello, World!" in ```localhost:8080```:
```
$ fab deploy:dev serve:dev
```

Test prod environment. You should see "Hello, World!" in ```localhost:8080```:
```
$ fab deploy serve
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

##Cloud Setup (Linux)
###Updating APT Packages
```
$ sudo apt-get update
```

###Installing ```git```
```
$ sudo apt-get install git-core
```

###Installing ```upstart```
```
$ sudo apt-get install upstart
```
Yes, replace ```sysvinit```

###Installing ```nvm```/```node```/```npm``` Globally

Install dependencies:
```
$ sudo apt-get install build-essential openssl libssl-dev curl
```

Clone ```nvm``` repo:
```
$ sudo git clone https://github.com/creationix/nvm.git /opt/nvm
```

Create directories where ```nvm``` and ```node``` will be globally installed to:
```
$ sudo mkdir /usr/local/nvm
$ sudo mkdir /usr/local/node
```

Change the permissions of the newly created directories so you can write to it when you install ```node```:
```
$ sudo chown -R your_admin_user_name /usr/local/nvm
$ sudo chmod -R 775 /usr/local/nvm
$ sudo chown -R your_admin_user_name /usr/local/node
$ sudo chmod -R 775 /usr/local/node
```

Create ```nvm.sh``` to be executed everytime the shell loads up:
```
$ sudo touch /etc/profile.d/nvm.sh
```

Add the following to ```nvm.sh```:
```
export NVM_DIR=/usr/local/nvm
source /opt/nvm/nvm.sh
export NPM_CONFIG_PREFIX=/usr/local/node
export PATH="/usr/local/node/bin:$PATH"
```

Log out and log back in or ```source``` the file so changes can take effect:
```
$ source /etc/profile.d/nvm.sh
```

Install preferred ```node``` version:
```
$ nvm install x.xx.x
```

Set ```node``` version as default so shell can remember it the next time you log in:
```
$ nvm alias default x.xx.x
```

###Installing ```python```/```pip```
```
$ sudo apt-get install python-pip python-virtualenv python-dev build-essential
```

###Installing PostgreSQL
```
$ sudo apt-get install libpq-dev python-dev python-psycopg2
$ sudo apt-get install postgresql postgresql-contrib
```

###Installing MySQL
```
$ sudo apt-get install mysql-server
$ sudo apt-get install python-mysqldb
```

###Installing uWSGI
```
$ sudo pip install uwsgi
```

###Installing Nginx
```
$ sudo apt-get install nginx
```

###Serving with uWSGI and Nginx
Configure ```<%= appname %>_uwsgi.ini``` and ```<%= appname %>_nginx.conf``` files to reflect the correct server name.

Symlink ```<%= appname %>_nginx.conf``` so Nginx can see it:
```
$ sudo ln -s /path/to/your/<%= appname %>_nginx.conf /etc/nginx/sites-enabled/
```

Restart Nginx:
```
$ sudo service nginx restart
```

Create directory for storing uWSGI vassals:
```
$ sudo mkdir /etc/uwsgi
$ sudo mkdir /etc/uwsgi/vassals
```

Symlink ```<%= appname %>_uwsgi.ini```
```
$ sudo ln -s /path/to/your/<%= appname %>_uwsgi.ini /etc/uwsgi/vassals/
```

Run uWSGI in emperor mode:
```
$ uwsgi --emperor /etc/uwsgi/vassals --uid www-data --gid www-data
```

Make uWSGI startup when the system boots using ```upstart```:
```
$ sudo nano /etc/init/uwsgi.conf
```
Add:
```
description "uWSGI Emperor"

start on runlevel [2345]
stop on runlevel [!2345]

script
    . /path/to/virtualenv/bin/activate
    uwsgi --emperor /etc/uwsgi/vassals
end script
```

Visit external IP of your VM instance. Voila.

##Common Issues
1. If Nginx cannot serve the project (getting a 500 Internal Error or something like that), check the error logs at ```/var/log/nginx/error.log```.
2. If Modernizr is not being deployed, you will need to add ```"main": "modernizr.js"``` to its ```bower.json``` so that ```main-bower-files``` can pick it up.

##License
This software is released under the [MIT License](http://opensource.org/licenses/MIT).
