from django.urls import path
from .views import ChatRoomView, MessageView

urlpatterns = [
    path("create-chatroom/", ChatRoomView.as_view(), name="create_chatroom"),
    path("chatroom/<str:chatroom_id>/", ChatRoomView.as_view(), name="get_chatroom"),
    path(
        "delete-chatroom/<str:chatroom_id>/",
        ChatRoomView.as_view(),
        name="delete_chatroom",
    ),
    path("send-message/", MessageView.as_view(), name="send_message"),
    path("message/<str:message_id>/", MessageView.as_view(), name="delete_message"),
    path("messages/<str:chatroom_id>/", MessageView.as_view(), name="get_messages"),
]
