from django.urls import path
from application.views.admin_post_view import AdminPostView
from application.views.post_view import PostView, SearchView
from application.views.enum_view import EnumView


urlpatterns = [
    path("posts/", PostView.as_view(), name="posts"),
    path("posts/<str:pk>/", PostView.as_view(), name="posts-detail"),
    path("admin/posts/", AdminPostView.as_view(), name="admin-posts"),
    path("admin/posts/<str:pk>/", AdminPostView.as_view(), name="admin-posts-detail"),
    path("enum/", EnumView.as_view(), name="enum"),
    path("search/", SearchView.as_view(), name="search"),
]
