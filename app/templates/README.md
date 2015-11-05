# <%= appname %>

This project is scaffolded by [Yeoman](http://yeoman.io). See [generator-vars-django](https://github.com/VARIANTE/generator-vars-django.git) for more details.

## Usage

Install node modules if they are not already installed:
```
$ npm install
```

Initialize ```virtualenv``` if needed:
```
$ virtualenv {path}
```

Add generated environment variables in ```./.environment``` to ```{virtualenv_path}/bin/activate``` if needed.

(Re)activate ```virtualenv```:
```
$ source {virtualenv_path}/bin/activate
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
$ sudo su postgres
$ createuser -P
$ createdb --owner username dbname
$ exit
```

Configure MySQL if needed:
```
$ mysql_secure_installation
$ mysql --user=root --password={password}
$ mysql> create database {db_name};
$ mysql> quit;
```

Update environment variables in ```{virtualenv_path}/bin/activate``` with new database configs.

Apply initial migration:
```
$ gulp migrate
```

Test dev environment. You should see "Hello, World!":
```
$ gulp --debug --serve
```

Test prod environment. You should see "Hello, World!":
```
$ gulp --serve
```

## Tasks

```gulp --debug --watch --serve```: Compiles all source files, serves the site and watches for file changes. Best used during development.

```gulp```: Builds the entire project in production.

All tasks are broken into micro-tasks, check out the ```tasks``` folder for more details. Also see ```tasks/.taskconfig``` for more custom flags such as ```--skip-js-min```, ```--skip-css-min```, etc.


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

### Installing ```nvm``` Globally

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
$ uwsgi --emperor /etc/uwsgi/vassals
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
    . {virtualenv_path}/bin/activate
    uwsgi --emperor /etc/uwsgi/vassals
end script
```

Visit external IP of your VM instance. Voila.

## Optional Environment Variables

1. `DJANGO_CONFIG_DEBUG`: You can set this to any string you want in `bin/activate` of your `virtualenv`. This will force `gulp` command to build the app in debug, which is useful when you have different environment setup in the cloud.

## Common Issues

1. If Nginx cannot serve the project (getting a 500 Internal Error or something like that), check the error logs at ```/var/log/nginx/error.log```.

2. If you get an error about permission issues with writing to the UDP socket upon starting the uWSGI emperor, you might need to change the owner of the project directory to the Nginx owner/group, which is probably `www-data:www-data`

3. If you are getting a 400 error, you can debug this using your browser console to see what is wrong. If you get a GET request fail on the domain itself, chances are you forgot to add your domain to the ALLOWED_HOSTS of your Django project settings.

4. If you are getting a 500 error, enable DEBUG in project/settings/prod.py. It could be something trivial.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).
