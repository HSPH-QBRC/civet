from rest_framework.serializers import ModelSerializer

from api.models.visit import SubjectVisit


class SubjectVisitSerializer(ModelSerializer):
    class Meta:
        model = SubjectVisit
        fields = '__all__'
