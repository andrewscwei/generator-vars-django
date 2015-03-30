"""
<%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
(c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>

WSGI config for project project.

It exposes the WSGI callable as a module-level variable named ``application``.

This software is released under the MIT License:
http://www.opensource.org/licenses/mit-license.php
"""

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.prod")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
