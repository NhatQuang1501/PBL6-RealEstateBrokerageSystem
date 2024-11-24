from rest_framework import serializers

class PredictionInputSerializer(serializers.Serializer):
    area = serializers.FloatField()
    width = serializers.FloatField()
    length = serializers.FloatField()
    has_frontage = serializers.BooleanField()
    has_car_lane = serializers.BooleanField()
    has_rear_expansion = serializers.BooleanField()
    orientation = serializers.CharField()
    ward = serializers.CharField()