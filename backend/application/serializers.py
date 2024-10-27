from rest_framework import serializers
from accounts.models import *
from application.models import *
from accounts.enums import *


class PostSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    reactions_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "user",
            "post_id",
            "title",
            "estate_type",
            "price",
            "status",
            "city",
            "district",
            "street",
            "address",
            "orientation",
            "area",
            "frontage",
            "bedroom",
            "bathroom",
            "floor",
            "legal_status",
            "sale_status",
            "images",
            "description",
            "created_at",
            "updated_at",
            "reactions_count",
            "view_count",
        ]
        extra_kwargs = {
            "post_id": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "status": {"read_only": True},
            "title": {"required": True},
            "estate_type": {"required": True},
            "price": {"required": True},
            "city": {"required": True},
            "district": {"required": False},
            "street": {"required": False},
            "address": {"required": True},
            "orientation": {"required": False},
            "area": {"required": True},
            "frontage": {"required": False},
            "bedroom": {"required": False},
            "bathroom": {"required": False},
            "floor": {"required": False},
            "legal_status": {"required": True},
            "sale_status": {"required": True},
            "images": {"required": False},
            "description": {"required": False},
            "view_count": {"read_only": True},
        }

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if representation["estate_type"]:
            representation["estate_type"] = EstateType.map_value_to_display(
                representation["estate_type"]
            )

        if representation["orientation"]:
            representation["orientation"] = Orientation.map_value_to_display(
                representation["orientation"]
            )

        if representation["legal_status"]:
            representation["legal_status"] = Legal_status.map_value_to_display(
                representation["legal_status"]
            )

        if representation["sale_status"]:
            representation["sale_status"] = Sale_status.map_value_to_display(
                representation["sale_status"]
            )

        if representation["status"]:
            representation["status"] = Status.map_value_to_display(
                representation["status"]
            )

        request_type = self.context.get("request_type")

        return representation

    def to_internal_value(self, data):
        estate_type = data.get("estate_type")
        orientation = data.get("orientation")
        legal_status = data.get("legal_status")
        sale_status = data.get("sale_status")
        user_id = data.get("user_id")

        if estate_type:
            data["estate_type"] = EstateType.map_display_to_value(estate_type)

        if orientation:
            data["orientation"] = Orientation.map_display_to_value(orientation)

        if legal_status:
            data["legal_status"] = Legal_status.map_display_to_value(legal_status)

        if sale_status:
            data["sale_status"] = Sale_status.map_display_to_value(sale_status)

        if user_id:
            user = User.objects.get(user_id=user_id)
            data["user_id"] = user

        return data

    def create(self, validated_data):
        post = Post.objects.create(**validated_data)
        return post

    def update(self, instance, validated_data):
        instance.title = validated_data.get("title", instance.title)
        instance.estate_type = validated_data.get("estate_type", instance.estate_type)
        instance.price = validated_data.get("price", instance.price)
        instance.city = validated_data.get("city", instance.city)
        instance.district = validated_data.get("district", instance.district)
        instance.street = validated_data.get("street", instance.street)
        instance.address = validated_data.get("address", instance.address)
        instance.orientation = validated_data.get("orientation", instance.orientation)
        instance.area = validated_data.get("area", instance.area)
        instance.frontage = validated_data.get("frontage", instance.frontage)
        instance.bedroom = validated_data.get("bedroom", instance.bedroom)
        instance.bathroom = validated_data.get("bathroom", instance.bathroom)
        instance.floor = validated_data.get("floor", instance.floor)
        instance.legal_status = validated_data.get(
            "legal_status", instance.legal_status
        )
        instance.sale_status = validated_data.get("sale_status", instance.sale_status)
        instance.images = validated_data.get("images", instance.images)
        instance.description = validated_data.get("description", instance.description)
        instance.status = Status.PENDING_APPROVAL
        instance.view_count = validated_data.get("view_count", instance.view_count)
        instance.save()

        return instance

    def get_user(self, obj):
        user_profile = UserProfile.objects.get(user=obj.user_id)
        return {
            "user_id": obj.user_id.user_id,
            "username": obj.user_id.username,
            "fullname": user_profile.fullname,
        }

    def get_fullname(self, obj):
        user = UserProfile.objects.get(user=obj.user_id)
        return user.fullname

    def get_username(self, obj):
        username = obj.user_id.username
        return username
    
    def get_reactions_count(self, obj):
        return PostReaction.objects.filter(post_id=obj).count()
    

class PostCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostComment
        fields = [
            "comment_id",
            "post_id",
            "user_id",
            "comment",
            "created_at",
        ]
        extra_kwargs = {
            "comment_id": {"read_only": True},
            "created_at": {"read_only": True},
            "comment": {"required": True},
        }
    
    def create(self, validated_data):
        post_comment = PostComment.objects.create(**validated_data)
        return post_comment
    

class PostReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostReaction
        fields = [
            "reaction_id",
            "post_id",
            "user_id",
            "reaction_type",
            "created_at",
        ]
        extra_kwargs = {
            "reaction_id": {"read_only": True},
            "created_at": {"read_only": True},
        }
    
    def create(self, validated_data):
        return super().create(validated_data)