from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("", WelcomeView.as_view(), name="welcome"),
    # Authentication Endpoints
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    # Email Verification Endpoints
    path("email-verify/", VerifyEmailView.as_view(), name="email-verify"),
    path("email-reverify/", ReverifyEmailView.as_view(), name="email-reverify"),
    # User Profile Endpoints
    path("users/", UserView.as_view(), name="users"),
    path("users/<str:pk>/", UserView.as_view(), name="users-profile"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users-avatar/", AvatarView.as_view(), name="users-avatar"),
    path("users-avatar/<str:pk>/", AvatarView.as_view(), name="get-user-avatar"),
    # Lock user account Endpoints
    path("lock-users/", LockUserView.as_view(), name="lock-user-list"),
    path("lock-users/<str:user_id>/", LockUserView.as_view(), name="lock-user"),
    path("unlock-users/<str:user_id>/", UnlockUserView.as_view(), name="unlock-user"),
    path("report-comment/<str:pk>/", AdminPostCommentView.as_view()),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]
