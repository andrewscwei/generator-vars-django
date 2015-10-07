"""
<%= appname %><% if (appauthor !== '' || appauthoremail !== '') { %>
(c)<% if (appauthor !== '') { %> <%= appauthor %><% } %><% if (appauthoremail !== '') { %> <<%= appauthoremail %>><% } %><% } %>

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic.base import TemplateView

urlpatterns = patterns('',
  url(r'^robots\.txt$', TemplateView.as_view(template_name='robots.txt', content_type='text/plain')),
  # url(r'^admin/', include(admin.site.urls)),
  url(r'^$', 'project.views.index', name='index'),
)
