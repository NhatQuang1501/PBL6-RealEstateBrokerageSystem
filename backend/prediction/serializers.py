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

class HouseTypeField(serializers.ChoiceField):
    def to_internal_value(self, data):
        value = HouseType.map_display_to_value(data)
        if value is None:
            self.fail('invalid_choice', input=data)
        return value

    def to_representation(self, value):
        return HouseType.map_value_to_display(value)
    
class FurnishingSellField(serializers.ChoiceField):
    def to_internal_value(self, data):
        value = FurnishingSell.map_display_to_value(data)
        if value is None:
            self.fail('invalid_choice', input=data)
        return value

    def to_representation(self, value):
        return FurnishingSell.map_value_to_display(value)

class HousePredictionSerializer(serializers.Serializer):
    area = serializers.FloatField()
    floors = serializers.IntegerField()
    rooms = serializers.IntegerField()
    toilets = serializers.IntegerField()
    house_type = HouseTypeField(choices=HouseType.choices)
    furnishing_sell = FurnishingSellField(choices=FurnishingSell.choices)
    living_size = serializers.FloatField()
    width = serializers.FloatField()
    length = serializers.FloatField()
    orientation = serializers.CharField()
    street = serializers.CharField()
    ward = serializers.CharField()        