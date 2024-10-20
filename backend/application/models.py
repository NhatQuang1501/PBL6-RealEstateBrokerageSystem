from django.db import models
from accounts.models import *
from accounts.enums import *
import uuid


class Post(models.Model):
    post_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    title = models.CharField(max_length=100)
    estate_type = models.CharField(choices=EstateType.choices, max_length=50)
    price = models.DecimalField(max_digits=30, decimal_places=1)
    status = models.CharField(
        choices=Status.choices, max_length=50, default=Status.PENDING_APPROVAL
    )

    city = models.CharField(max_length=50, blank=True, null=True)
    district = models.CharField(max_length=50, blank=True, null=True)
    street = models.CharField(max_length=50, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    orientation = models.CharField(
        choices=Orientation.choices, max_length=50, blank=True, null=True
    )

    area = models.DecimalField(max_digits=20, decimal_places=1, blank=True, null=True)
    frontage = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True
    )  # mặt tiền
    bedroom = models.IntegerField(blank=True, null=True)
    bathroom = models.IntegerField(blank=True, null=True)
    floor = models.IntegerField(blank=True, null=True)
    legal_status = models.CharField(
        choices=Legal_status.choices,
        max_length=50,
    )
    sale_status = models.CharField(choices=Sale_status.choices, max_length=50)

    images = models.ImageField(upload_to="post_images", blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.post_id)


# class Negotiation(models.Model):
#     negotiation_id = models.UUIDField(
#         primary_key=True, default=uuid.uuid4, editable=False
#     )

#     post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
#     user_id = models.ForeignKey(User, on_delete=models.CASCADE)

#     price = models.FloatField()

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return self.negotiation_id


# class Reaction(models.Model):
#     reaction_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

#     post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
#     user_id = models.ForeignKey(User, on_delete=models.CASCADE)

#     reaction = models.CharField(choices=Reaction.choices, max_length=50)

#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return self.reaction_id


# class Comment(models.Model):
