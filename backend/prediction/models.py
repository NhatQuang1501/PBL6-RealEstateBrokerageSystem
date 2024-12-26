from rest_framework import serializers
from accounts.enums import *

class PredictionInputSerializer(serializers.Serializer):
    area = serializers.FloatField()
    width = serializers.FloatField()
    length = serializers.FloatField()
    has_frontage = serializers.BooleanField()
    has_car_lane = serializers.BooleanField()
    has_rear_expansion = serializers.BooleanField()
    orientation = serializers.CharField()
    ward = serializers.CharField()

class HousePredictionSerializer(serializers.Serializer):
    area = serializers.FloatField()
    floors = serializers.IntegerField()
    rooms = serializers.IntegerField()
    toilets = serializers.IntegerField()
    house_type = serializers.ChoiceField(choices=HouseType.choices)
    furnishing_sell = serializers.ChoiceField(choices=FurnishingSell.choices)
    living_size = serializers.FloatField()
    width = serializers.FloatField()
    length = serializers.FloatField()
    orientation = serializers.CharField()
    street = serializers.CharField()
    ward = serializers.CharField()