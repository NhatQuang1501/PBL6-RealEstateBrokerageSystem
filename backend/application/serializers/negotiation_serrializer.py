from rest_framework import serializers
from accounts.models import *
from application.models import *
from accounts.enums import *
from accounts.serializers import *


class NegotiationSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    highest_negotiation_price = serializers.IntegerField(read_only=True)
    highest_negotiation_user = serializers.SerializerMethodField(read_only=True)
    proposals = serializers.SerializerMethodField()

    class Meta:
        model = Negotiation
        fields = [
            "negotiation_id",
            "post",
            "user",
            "negotiation_price",
            "negotiation_date",
            "payment_method",
            "negotiation_note",
            "is_considered",
            "is_accepted",
            "created_at",
            "highest_negotiation_price",
            "highest_negotiation_user",
            "proposals",
        ]
        extra_kwargs = {"negotiation_id": {"read_only": True}}

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        if rep["payment_method"]:
            rep["payment_method"] = Payment_method.map_value_to_display(
                rep["payment_method"]
            )

        # Lấy thương lượng cao nhất từ bài đăng
        rep["highest_negotiation_price"] = instance.post.highest_negotiation_price
        # Serialize thông tin người dùng cao nhất
        highest_user = instance.post.highest_negotiation_user
        if highest_user:
            rep["highest_negotiation_user"] = {
                "user_id": highest_user.user_id,
                "username": highest_user.username,
                "fullname": UserProfile.objects.get(user=highest_user).fullname,
            }
        else:
            rep["highest_negotiation_user"] = None
        return rep

    def to_internal_value(self, data):
        payment_method = data.get("payment_method")
        user = data.get("user")

        if payment_method:
            data["payment_method"] = Payment_method.map_display_to_value(payment_method)

        if user:
            user = User.objects.get(user_id=user)
            data["user"] = user

        return data

    def get_user(self, obj):
        user_profile = UserProfile.objects.get(user=obj.user)
        return {
            "user_id": obj.user.user_id,
            "username": obj.user.username,
            "fullname": user_profile.fullname,
        }

    def get_highest_negotiation_user(self, obj):
        highest_negotiation = obj.post.negotiations.order_by(
            "-negotiation_price"
        ).first()

        if highest_negotiation:
            user_profile = UserProfile.objects.get(user=highest_negotiation.user)
            return {
                "user_id": highest_negotiation.user.user_id,
                "username": highest_negotiation.user.username,
                "fullname": user_profile.fullname,
            }

        return None

    def get_proposals(self, obj):
        proposals = Proposal.objects.filter(negotiation=obj).order_by("-created_at")
        return ProposalSerializer(proposals, many=True).data


class ProposalSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True
    )

    class Meta:
        model = Proposal
        fields = [
            "proposal_id",
            "user",
            "user_id",
            "negotiation",
            "proposal_price",
            "proposal_date",
            "proposal_method",
            "proposal_note",
            "is_accepted",
            "created_at",
        ]
        extra_kwargs = {"proposal_id": {"read_only": True}}

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        if rep["proposal_method"]:
            rep["proposal_method"] = Payment_method.map_value_to_display(
                rep["proposal_method"]
            )

        return rep

    def to_internal_value(self, data):
        proposal_method = data.get("proposal_method")
        user = data.get("user")

        if proposal_method:
            data["proposal_method"] = Payment_method.map_display_to_value(
                proposal_method
            )

        if user:
            user = User.objects.get(user_id=user)
            data["user"] = user

        return data

    def get_user(self, obj):
        user_profile = UserProfile.objects.get(user=obj.user)
        return {
            "user_id": obj.user.user_id,
            "username": obj.user.username,
            "fullname": user_profile.fullname,
        }
