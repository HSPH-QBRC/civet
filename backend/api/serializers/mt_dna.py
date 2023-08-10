from rest_framework.serializers import ModelSerializer

from api.models.mt_dna import MitoDNAMeasurement


class MitoDNASerializer(ModelSerializer):
    class Meta:
        model =  MitoDNAMeasurement
        fields = '__all__'
