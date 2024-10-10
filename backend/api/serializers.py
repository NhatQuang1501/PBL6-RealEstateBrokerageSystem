from rest_framework import serializers
from django.contrib.auth.models import User 
from .models import Role, UserRole, Post


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'date_joined')

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'date_joined', 'role')

    def get_role(self, obj):
        user_role = UserRole.objects.filter(user=obj).first()
        return user_role.role.name if user_role else None
    

class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['role'].choices = [(role.name, role.name.capitalize()) for role in Role.objects.all()]

    def create(self, validated_data):
        role_name = validated_data.pop('role')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        if role_name:
            role, created = Role.objects.get_or_create(name=role_name)
            UserRole.objects.create(user=user, role=role)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    
class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = ('id', 'author', 'title', 'type', 'price', 'city', 'district', 'street', 'area', 'bedroom', 'bathroom', 'description', 'created_at', 'updated_at')