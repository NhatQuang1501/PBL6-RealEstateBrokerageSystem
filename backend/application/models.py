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

    view_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.post_id} - {self.title}"


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


class PostReaction(models.Model):
    REACTION_CHOICES = (
        (1, "Like"),
        (0, "Unlike"),
    )
    reaction_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    reaction_type = models.IntegerField(choices=REACTION_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post_id', 'user_id')  # User chỉ được like 1 lần vào mỗi bài đăng

    def __str__(self):
        return f"{self.user_id} - {self.post_id} - {self.reaction_type}"


class PostComment(models.Model):
    comment_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.comment_id)
    
class PostImage(models.Model):
    image_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post_id = models.ForeignKey(Post, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="post_images", blank=True, null=True)

    def __str__(self):
        return str(self.image_id)

        

