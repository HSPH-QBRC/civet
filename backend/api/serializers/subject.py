from rest_framework.serializers import ModelSerializer

from api.models.subject import Subject


class SubjectSerializer(ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'