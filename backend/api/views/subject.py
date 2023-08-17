from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from api.models.subject import Subject
from api.serializers.subject import SubjectSerializer
from api.utils.solr import query_solr

class SubjectViewSet(ReadOnlyModelViewSet):
    """
    Read-only view for listing (all Subjects) 
    and retrieving a single Subject   
    """
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    lookup_field = 'subjid'


class SubjectQueryView(APIView):
    """This view is a query interface for the 'subject' solr core"""

    def get(self, request, *args, **kwargs):

        # the actual query to be run is included as a query param
        # string at the end of the url.
        query_params = request.query_params
        
        # `query_params` is of type QueryDict. Make
        # into an encoded url param:
        query_str = query_params.urlencode()

        # The payload had the proper keyword args. Make the query
        try:
            query_response = query_solr('subjects', query_str)
            return Response(query_response, status=status.HTTP_200_OK)
        except Exception as ex:
            # TODO: catch a more specific exception?
            return Response({'message': str(ex)},
                            status=status.HTTP_400_BAD_REQUEST)