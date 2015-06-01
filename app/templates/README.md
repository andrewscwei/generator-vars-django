# <%= appname %>

This project is scaffolded by [Yeoman](http://yeoman.io). See [generator-vars-django](https://github.com/VARIANTE/generator-vars-django.git) for more details.

## Usage

Install node modules if they are not already installed:
```
$ npm install
```

Initialize ```virtualenv``` if needed:
```
$ virtualenv .
```

Add generated environment variables in ```./.environment``` to ```./bin/activate``` if needed.

(Re)activate ```virtualenv```:
```
$ source bin/activate
```

Install ```pip``` dependencies using ```./requirements.txt``` they are not already installed:
```
$ pip install -r requirements.txt
```

Verify ```pip``` dependencies installed correctly under ```virtualenv```:
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

Update environment variables in ```./bin/activate``` with new database configs.

Apply initial migration:
```
$ gulp migrate
```

Test dev environment. You should see "Hello, World!":
```
$ gulp --debug
```

Test prod environment. You should see "Hello, World!":
```
$ gulp
```

## Tasks

### ```gulp```

```gulp build --debug```: Builds all static and template files in the ```app``` directory but skips all compression tasks. Built files are stored in the ```.tmp``` directory.

```gulp build```: Builds all static and template fies in the ```app``` directory with asset compression such as CSS/HTML/JavaScript minification and deploys them to the ```build``` directory.

```gulp serve --debug```: Serves the project in dev environment, begins watching files and automatically rebuilds and reloads browser when file changes are detected. It is recommended to use this environment during development to minimize build time.

```gulp serve```: Serves the project in prod environment, begins watching files and automatically rebuilds (fully) and reloads browser when file changes are detected.

See ```gulpfile.js``` for more tasks and custom flags such as ```--skip-uglify```, ```--skip-csso```, etc.


## Cloud Setup (Linux)

### Updating APT Packages

```
$ sudo apt-get update
```

### Installing ```git```

```
$ sudo apt-get install git-core
```

### Installing ```upstart```

```
$ sudo apt-get install upstart
```
Yes, replace ```sysvinit```

### Installing ```nvm```/```node```/```npm``` Globally

Install ```nvm``` (see [https://github.com/xtuple/nvm](https://github.com/xtuple/nvm)):
```
$ sudo wget -qO- https://raw.githubusercontent.com/xtuple/nvm/master/install.sh | sudo bash
```

Install preferred ```node``` version:
```
$ nvm install x.xx.x
```

### Installing ```python```/```pip```

```
$ sudo apt-get install python-pip python-virtualenv python-dev build-essential
```

### Installing PostgreSQL

```
$ sudo apt-get install libpq-dev python-dev python-psycopg2
$ sudo apt-get install postgresql postgresql-contrib
```

### Installing MySQL

```
$ sudo apt-get install mysql-server
$ sudo apt-get install python-mysqldb
```

### Installing uWSGI

```
$ sudo pip install uwsgi
```

### Installing Nginx

```
$ sudo apt-get install nginx
```

### Serving with uWSGI and Nginx

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

## Common Issues

1. If Nginx cannot serve the project (getting a 500 Internal Error or something like that), check the error logs at ```/var/log/nginx/error.log```.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
