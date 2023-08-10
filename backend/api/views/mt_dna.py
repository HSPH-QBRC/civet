from rest_framework.generics import ListAPIView

from api.models.mt_dna import MitoDNAMeasurement
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
