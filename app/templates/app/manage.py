#!/usr/bin/env python

"""
<%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
(c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>

This software is released under the MIT License:
http://www.opensource.org/licenses/mit-license.php
"""

import os
import sys

if __name__ == "__main__":
  os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.dev")

  from django.core.management import execute_from_command_line

  execute_from_command_line(sys.argv)
