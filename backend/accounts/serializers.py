from rest_framework import serializers
from .utils import get_tokens_for_user
from .models import *
from rest_framework.exceptions import AuthenticationFailed
from django.contrib import auth
from .models import *
from .enums import *
from application.models import *
from datetime import datetime, timedelta


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "username", "password", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.is_verified = False
        user.save()

        print(user)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)
    user_id = serializers.UUIDField(source="user.user_id", read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "user_id",
            "user",
            "fullname",
            "city",
            "birthdate",
            "phone_number",
            "gender",
            "avatar",
            "reputation_score",
            "successful_transactions",
            "response_rate",
            "profile_completeness",
            "negotiation_experience",
        ]
        extra_kwargs = {
            "user_id": {"read_only": True},
            "fullname": {"required": False},
            "city": {"required": False},
            "birthdate": {"required": False},
            "phone_number": {"required": False},
            "gender": {"required": False},
            "avatar": {"required": False},
            "reputation_score": {"read_only": True},
            "successful_transactions": {"read_only": True},
            "response_rate": {"read_only": True},
            "profile_completeness": {"read_only": True},
            "negotiation_experience": {"read_only": True},
        }

    def validate(self, data):
        if not self.instance and "user" not in data:
            raise serializers.ValidationError(
                {"user": "Hãy điền thông tin tài khoản đúng cú pháp"}
            )

        return data

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        for field in rep:
            if rep[field] is None:
                if field == "avatar":
                    rep[field] = None
                else:
                    rep[field] = "Chưa có thông tin"

            elif field == "gender":
                rep[field] = Gender.map_value_to_display(rep[field])

        return rep

    def to_internal_value(self, data):
        data = data.copy()
        gender = data.get("gender", None)

        if gender:
            data["gender"] = Gender.map_display_to_value(str(gender))

        return data

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user = User.objects.create_user(**user_data)
        user.is_verified = False
        user.save()

        user_profile = UserProfile.objects.create(user=user, **validated_data)

        return user_profile

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.fullname = validated_data.get("fullname", instance.fullname)
        instance.city = validated_data.get("city", instance.city)
        instance.birthdate = validated_data.get("birthdate", instance.birthdate)
        instance.phone_number = validated_data.get(
            "phone_number", instance.phone_number
        )
        instance.gender = validated_data.get("gender", instance.gender)

        avatar = validated_data.get("avatar", None)
        if avatar:
            if isinstance(avatar, list):
                avatar = avatar[0]
            instance.avatar = avatar

        # Tính và cập nhật profile_completeness
        instance.profile_completeness = self.calculate_profile_completeness(instance)
        # Tính toán các chỉ số khác (nếu có logic)
        instance.reputation_score = self.calculate_reputation_score(instance)
        instance.successful_transactions = self.calculate_successful_transactions(
            instance
        )
        instance.response_rate = self.calculate_response_rate(instance)
        instance.negotiation_experience = self.calculate_negotiation_experience(
            instance
        )

        instance.save()

        return instance

    def calculate_profile_completeness(self, instance):
        required_fields = [
            "fullname",
            "city",
            "birthdate",
            "phone_number",
            "gender",
            "avatar",
        ]
        filled_fields = sum(1 for field in required_fields if getattr(instance, field))
        completeness = (filled_fields / len(required_fields)) * 100

        return round(completeness, 2)

    def calculate_reputation_score(self, instance):
        return instance.reputation_score

    def calculate_successful_transactions(self, instance):
        total_negotiations = Negotiation.objects.filter(user=instance.user).count()
        successful_transactions = Negotiation.objects.filter(
            user=instance.user, is_accepted=True
        ).count()
        return successful_transactions

    def calculate_response_rate(self, instance):
        total_negotiations = Negotiation.objects.filter(user=instance.user).count()
        responded = Negotiation.objects.filter(
            user=instance.user, average_response_time__lt=timedelta(hours=1)
        ).count()
        response_rate = (
            (responded / total_negotiations) * 100 if total_negotiations > 0 else 0.0
        )
        return response_rate

    def calculate_negotiation_experience(self, instance):
        return instance.negotiation_experience
