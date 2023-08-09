from rest_framework.generics import ListAPIView

from api.models.visit import SubjectVisit
from api.serializers.subject_visit import SubjectVisitSerializer


class SubjectVisitList(ListAPIView):
    """
    Read-only view for listing all visits for a
    given Subject
    """
    serializer_class = SubjectVisitSerializer

    def get_queryset(self):
        """
        This view should return a set of unique visits
        for a particular subject
        """
        subjid = self.kwargs['subjid']
        return SubjectVisit.objects.filter(subject__subjid=subjid)
