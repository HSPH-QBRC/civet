from django.urls import path

from api.views import ApiRoot

urlpatterns = [
    path('', ApiRoot.as_view(), name='api-root')
]
