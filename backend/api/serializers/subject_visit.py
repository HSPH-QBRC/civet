from rest_framework.serializers import ModelSerializer

from api.models.visit import SubjectVisit


class SubjectVisitSerializer(ModelSerializer):
    class Meta:
        model = SubjectVisit
        # explicitly enumerate fields, otherwise we
        # get the integer PK returned, which is unnecessary
        fields = ['subject', 'visit_id', 'date_visit']
