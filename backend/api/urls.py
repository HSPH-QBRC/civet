from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, \
    TokenRefreshView

from api.views import ApiRoot, \
    SubjectViewSet, \
    SubjectVisitList, \
    MitoDNAList, \
    MitoDNACohortView, \
    SubjectQueryView, \
    SubjectDictionaryView

urlpatterns = [

    # for handling api authentication:
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # lists all subjects
    path('subjects/',
         SubjectViewSet.as_view({'get': 'list'}),
         name='subject-list'),
    # retrieves a single subject
    path('subjects/<str:subjid>/',
         SubjectViewSet.as_view({'get': 'retrieve'}),
         name='subject-detail'),
    path('subject-query/',
         SubjectQueryView.as_view(),
         name='subject-query'),
    path('subject-dictionary/',
         SubjectDictionaryView.as_view(),
         name='subject-dictionary'),
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
         name='mito-cohort'),

    path('', ApiRoot.as_view(), name='api-root'),
]
