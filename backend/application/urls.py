from django.urls import path
from application.views.admin_post_view import AdminPostView
from application.views.post_view import *
from application.views.enum_view import EnumView


urlpatterns = [
    path("posts/", PostView.as_view(), name="posts"),
    path("posts/<str:pk>/", PostView.as_view(), name="posts-detail"),
    path("admin/posts/", AdminPostView.as_view(), name="admin-posts"),
    path("admin/posts/<str:pk>/", AdminPostView.as_view(), name="admin-posts-detail"),
    path("enum/", EnumView.as_view(), name="enum"),
    path("search/", SearchView.as_view(), name="search"),
    path("posts/<str:pk>/comments/", PostCommentView.as_view(), name="post-comments"),
    path("posts/<str:pk>/like/", PostReactionView.as_view(), name="post-like"),
    path("user-posts-like/", UserPostReactionView.as_view(), name="user-posts-like"),
    path("posts/<str:pk>/images/", PostImageView.as_view(), name="post-images"),
]
