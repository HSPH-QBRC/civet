from collections import defaultdict

from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from api.models.mt_dna import MitoDNAMeasurement
from api.models.visit import SubjectVisit
from api.serializers.mt_dna import MitoDNASerializer


class MitoDNAList(ListAPIView):
    """
    Read-only view for listing all measurements of a given
    biofluid. Note that this will not segregate the data
    based on the time of sample.
    """
    serializer_class = MitoDNASerializer

    def get_queryset(self):
        source_biofluid = self.kwargs['source']
        return MitoDNAMeasurement.objects.filter(source=source_biofluid)


class MitoDNACohortView(APIView):
    """
    Read-only view for listing measurements for a set
    of selected subjects. 

    The user POSTs a list of subject IDs and this endpoint
    returns a data structure like:
    ```
    {
        "CU100010": {
            "VISIT_1": 259.151
        },
        "CU100047": {
            "VISIT_1": 88.176,
            "VISIT_4": 50.578
        }
    }
    ```
    """

    def post(self, request, *args, **kwargs):
        # extracts the post payload:
        data = request.data

        # from the url:
        source = kwargs['source']

        # the user needs to supply a list of subject IDs.
        try:
            subject_list = data['subject_list']
            assert type(subject_list) is list
        except KeyError:
            return Response({'error': 'You need to supply a '
                             '"subject_list" key with a list of subject IDs'},
                            status=status.HTTP_400_BAD_REQUEST)
        except AssertionError:
            return Response({'error': 'The "subject_list" key must'
                             ' reference a list of subject IDs'},
                            status=status.HTTP_400_BAD_REQUEST)

        # get all the visits associated with the requested users:
        all_user_visits = SubjectVisit.objects.filter(
            subject__in=subject_list)
        measurements = MitoDNAMeasurement.objects.filter(
            visit__in=all_user_visits,
            source=source)

        payload = defaultdict(dict)
        for m in measurements:
            payload[m.visit.subject.subjid][m.visit.visit_id] = float(
                m.measurement)
        return Response(payload)
