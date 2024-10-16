from django.contrib import admin
from django.urls import path, include
from api.views import DashboardView, PostListCreateView, PostDetailView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    path('api/dashboard/', DashboardView.as_view(), name='dashboard'),
    
    path('api/posts/', PostListCreateView.as_view(), name='post_list_create'),
    path('api/posts/<int:pk>', PostDetailView.as_view(), name='post_detail'),

]
