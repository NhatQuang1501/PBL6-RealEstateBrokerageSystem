from django.urls import path
from application.views.admin_post_view import AdminPostView
from application.views.post_view import *
from application.views.enum_view import EnumView
from application.views.negotiation_view import *
from application.views.ordered_post_view import *


urlpatterns = [
    # Post Management Endpoints
    path("posts/", PostView.as_view(), name="posts"),
    path("pending-posts/", PendingPostView.as_view(), name="pending-posts"),
    path(
        "pending-posts/<str:pk>/", PendingPostView.as_view(), name="user-pending-posts"
    ),
    path("posts/<str:pk>/", PostView.as_view(), name="posts-detail"),
    path("admin/posts/", AdminPostView.as_view(), name="admin-posts"),
    path("admin/posts/<str:pk>/", AdminPostView.as_view(), name="admin-posts-detail"),
    # Ordered Post Endpoints
    path("oldest-posts/", OldestPostView.as_view(), name="oldest-posts"),
    path("house-posts/", HousePostView.as_view(), name="house-posts"),
    path("land-posts/", LandPostView.as_view(), name="land-posts"),
    path("popular-posts/", PopularPostView.as_view(), name="popular-posts"),
    path("saved-posts/<str:pk>/", SavePostView.as_view(), name="saved-posts"),
    # Sold Post Endpoints
    path(
        "sold-posts/",
        MarkPostAsSoldView.as_view(),
        name="sold_post",
    ),
    path(
        "sold-posts/<str:post_id>/",
        MarkPostAsSoldView.as_view(),
        name="mark-post-as-sold",
    ),
    # Enum Data Endpoint
    path("app/enum/", EnumView.as_view(), name="enum"),
    # Search Endpoint
    path("search/", SearchView.as_view(), name="search"),
    # Comments Endpoints
    path("posts/<str:pk>/comments/", PostCommentView.as_view(), name="post-comments"),
    # Reaction Endpoints
    path("posts/<str:pk>/like/", PostReactionView.as_view(), name="post-like"),
    path("user-posts-like/", UserPostReactionView.as_view(), name="user-posts-like"),
    # Post images Endpoints
    path("posts/<str:pk>/images/", PostImageView.as_view(), name="post-images"),
    # Negotiation Endpoints
    path(
        "negotiations/", NegotiationsView.as_view(), name="negotiations-list"
    ),  # URL không có negotiation_id
    path(
        "negotiations/<str:negotiation_id>/",
        NegotiationsView.as_view(),
        name="negotiations-detail",
    ),
    path(
        "user-negotiations/",
        UserNegotiationsView.as_view(),
        name="user-negotiations-list",
    ),
    path(
        "user-negotiations/<str:negotiation_id>/",
        UserNegotiationsView.as_view(),
        name="user-negotiations-detail",
    ),
    path(
        "post-negotiations/",
        PostNegotiationsView.as_view(),
        name="post-negotiations-list",
    ),
    path(
        "post-negotiations/<str:post_id>/",
        PostNegotiationsView.as_view(),
        name="post-negotiations",
    ),
    # path(
    #     "post-negotiations/<str:post_id>/",
    #     InitiateNegotiationView.as_view(),
    #     name="initiate_negotiation",
    # ),
    path(
        "accept-negotiations/",
        AcceptNegotiationView.as_view(),
        name="accept_negotiation",
    ),
    # path(
    #     "posts-highest-offer/<str:post_id>/",
    #     GetHighestOfferView.as_view(),
    #     name="get_highest_offer",
    # ),
]
