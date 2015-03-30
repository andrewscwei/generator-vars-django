"""
<%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
(c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>

This software is released under the MIT License:
http://www.opensource.org/licenses/mit-license.php
"""

import os
from fabric.api import local

# Root directory of the entire project.
PROJECT_DIR = os.path.dirname(__file__)

# Directory of the app directory.
APP_DIR = os.path.join(PROJECT_DIR, '<%= paths.src %>')

# Directory of the build directory.
BUILD_DIR = os.path.join(PROJECT_DIR, '<%= paths.build %>')

# Directory of the temporary directory.
TMP_DIR = os.path.join(PROJECT_DIR, '<%= paths.tmp %>')

# Invokes Django's shell command.
def shell():
    local('python ' + APP_DIR + '/manage.py shell')

# Invokes Django's migrate command.
def migrate():
    local('python ' + APP_DIR + '/manage.py migrate')

# Creates a new app.
def startapp(app_name):
    path = os.path.join(APP_DIR, 'project', 'apps', app_name)

    if not os.path.exists(path):
        os.mkdirs(path)

    local('python ' + APP_DIR + '/manage.py startapp ' + app_name + ' ' + os.path.join(APP_DIR, 'project', 'apps', app_name))

# Builds and deploys files to the build directory. Specifying 'dev' will deploy to the temporary directory
# without any asset compression. Specifying 'prod' or leaving parameter as default will deploy all files
# to the build directory with asset compression (i.e. JavaScript uglification, CSS/HTML minification, image
# compression, etc.).
def build(env='prod'):
    if (env == 'dev'):
        local('gulp build --debug')
    elif (env == 'prod'):
        local('gulp clean')
        local('gulp build')
        local('python ' + APP_DIR + '/manage.py collectstatic --noinput')
    else:
        print 'Unrecognized environment specified: ' + env + '.'
        print 'Please specify either \'dev\' or \'prod\'(default).'

# Runs the server in the specified environment.
def serve(env='prod'):
    if (env == 'dev'):
        local('python ' + APP_DIR + '/manage.py runserver 0.0.0.0:8080 --insecure')
    elif (env == 'prod'):
        local('python ' + BUILD_DIR + '/manage.py runserver 0.0.0.0:8080 --insecure --settings=project.settings.prod')
    else:
        print 'Unrecognized environment specified: ' + env + '.'
        print 'Please specify either \'dev\' or \'prod\'(default).'
