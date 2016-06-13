"""<% if (appauthor !== '') { %>
(c) <%= appauthor %><% } %>
Define all views here.
"""

from django.shortcuts import render
from django.template import RequestContext

# Index request.
def index(request):
  return render(request, 'index.html')

# 404 error request.
def error404(request):
  return render(request, '404.html')
