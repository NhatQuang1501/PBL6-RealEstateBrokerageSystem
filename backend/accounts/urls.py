from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("", WelcomeView.as_view(), name="welcome"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("email-verify/", VerifyEmailView.as_view(), name="email-verify"),
    path("email-reverify/", ReverifyEmailView.as_view(), name="email-reverify"),
    path("users/", UserView.as_view(), name="users"),
    path("users/<str:pk>/", UserView.as_view(), name="users-profile"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users-avatar/", AvatarView.as_view(), name="users-avatar"),
    path("users-avatar/<str:pk>/", AvatarView.as_view(), name="get-user-avatar"),
    path("report-comment/<str:pk>/", AdminPostCommentView.as_view()),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]
