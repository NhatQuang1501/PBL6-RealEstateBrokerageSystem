from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from .enums import *
import uuid


class User(AbstractUser):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    email = models.EmailField(max_length=255, unique=True, db_index=True)
    username = models.CharField(max_length=255, unique=True, db_index=True)
    password = models.CharField(max_length=255)
    role = models.CharField(choices=Role.choices, max_length=50)

    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_set",
        blank=True,
    )

    def __str__(self):
        return self.username


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    fullname = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    gender = models.CharField(
        choices=Gender.choices, max_length=50, blank=True, null=True
    )
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

    @property
    def user_id(self):
        return self.user_id

    def __str__(self):
        return f"{self.user.username} - {self.fullname}"
