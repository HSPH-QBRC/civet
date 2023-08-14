from django.urls import path

from api.views import ApiRoot, \
    SubjectViewSet, \
    SubjectVisitList, \
    MitoDNAList, \
    MitoDNACohortView

urlpatterns = [
    path('', ApiRoot.as_view(), name='api-root'),

    # lists all subjects
    path('subjects/',
         SubjectViewSet.as_view({'get': 'list'}),
         name='subject-list'),
    # retrieves a single subject
    path('subjects/<str:subjid>/',
         SubjectViewSet.as_view({'get': 'retrieve'}),
         name='subject-detail'),
    # lists all visits for given subject
    path('visits/<str:subjid>/',
         SubjectVisitList.as_view(),
         name='subject-visits'),
    # lists all mt-DNA measurements for a 
    # provided source biofluid
    path('mt-dna/<str:source>/',
         MitoDNAList.as_view(),
         name='mito-list'),
    # returns mt-DNA measurements for a set
    # of selected subjects
    path('mt-dna/<str:source>/cohort/',
         MitoDNACohortView.as_view(),
         name='mito-cohort')
]
