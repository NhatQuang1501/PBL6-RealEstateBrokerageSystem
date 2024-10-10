from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import RegisterView, LoginView, DashboardView, PostListCreateView, PostDetailView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/auth/login/', LoginView.as_view(), name='auth_login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/dashboard/', DashboardView.as_view(), name='dashboard'),
    
    path('api/posts/', PostListCreateView.as_view(), name='post_list_create'),
    path('api/posts/<int:pk>', PostDetailView.as_view(), name='post_detail'),

    # path('', include('api.urls')),
]
