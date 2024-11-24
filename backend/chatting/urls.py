from django.urls import path
from .views import *

urlpatterns = [
    path("chatrooms/", ChatRoomView.as_view(), name="chatrooms"),
    path(
        "chatrooms/<str:chatroom_id>/", ChatRoomView.as_view(), name="chatroom-detail"
    ),
    path(
        "chatrooms-messages/<str:pk>/",
        MessageView.as_view(),
        name="chatroom-messages",
    ),
]
