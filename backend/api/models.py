from django.db import models
from django.contrib.auth.models import User


class Role(models.Model):   
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    

class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_role')
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'role')
        
        
class Post(models.Model):
    # id = models.AutoField(primary_key=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")

    title = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    price = models.FloatField()

    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    orientation = models.CharField(max_length=100, blank=True, null=True)

    area = models.FloatField()
    bedroom = models.IntegerField()
    bathroom = models.IntegerField()
    description = models.TextField(max_length=500)

    # status = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    def __str__(self):
        return self.title
        