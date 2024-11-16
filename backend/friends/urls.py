from django.urls import path
from friends.views.chatmessage_view import *
from friends.views.friendrequest_view import *
from friends.views.enum_view import *


urlpatterns = [
    path("friends/enum/", EnumView.as_view(), name="enum"),
    # path(
    #     "chat/messages/<str:receiver_username>/",
    #     ChatMessageView.as_view(),
    #     name="my-messages",
    # ),
    # path("chat/messages/", ChatMessageView.as_view(), name="message"),
    # # path("search-user/<str:username>/", SearchUserView.as_view(), name="search-user"),
    path("friend-requests/", FriendRequestView.as_view(), name="friend-requests"),
    path(
        "friend-requests/<str:pk>/",
        FriendRequestView.as_view(),
        name="friend-request-detail",
    ),
    path(
        "friend-requests-sent/",
        SentFriendRequestView.as_view(),
        name="sent_friend_requests",
    ),
    path(
        "friend-requests-received/",
        ReceivedFriendRequestView.as_view(),
        name="received_friend_requests",
    ),
    path(
        "friendlist/<str:user_id>/",
        FriendListView.as_view(),
        name="accept_friend_requests",
    ),
    path(
        "unfriend/",
        FriendListView.as_view(),
        name="unfriend",
    ),
]
