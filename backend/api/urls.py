from django.urls import path

from api.views import ApiRoot, \
    SubjectViewSet, \
    SubjectVisitList

urlpatterns = [
    path('', ApiRoot.as_view(), name='api-root'),
    path('subjects/',
         SubjectViewSet.as_view({'get': 'list'}),
         name='subject-list'),
    path('subjects/<str:subjid>/',
         SubjectViewSet.as_view({'get': 'retrieve'}),
         name='subject-detail'),
    path('visits/<str:subjid>/',
         SubjectVisitList.as_view(),
         name='subject-visits'),
]
