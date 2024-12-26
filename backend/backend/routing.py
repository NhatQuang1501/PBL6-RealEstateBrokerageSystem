from django.urls import path
from chatting.consumers import ChatConsumer
from notification.consumers import NotificationConsumer

websocket_urlpatterns = [
    path("ws/chat/<str:chatroom_id>/", ChatConsumer.as_asgi()),
    path("ws/notifications/", NotificationConsumer.as_asgi()),
]
