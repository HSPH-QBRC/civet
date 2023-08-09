from rest_framework.viewsets import ReadOnlyModelViewSet

from api.models.subject import Subject
from api.serializers.subject import SubjectSerializer


class SubjectViewSet(ReadOnlyModelViewSet):
    """
    Read-only view for listing (all Subjects) 
    and retrieving a single Subject   
    """
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    lookup_field = 'subjid'