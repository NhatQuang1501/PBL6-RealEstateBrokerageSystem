from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from api.models import UserRole
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, PostSerializer
from .permissions import *
from .models import Post



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            user_serializer = UserSerializer(user)
            user_data = user_serializer.data
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': user_data
            })
        else:
            return Response({
                'detail': 'Invalid credentials'
            }, status=401)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get(self, request):
        user = request.user
        user_serializer = UserSerializer(user)
        return Response({
            'message': 'Welcome to Sweet Home!',
            'user': user_serializer.data
        }, status=200)
        
        
class PostListCreateView(generics.ListCreateAPIView):
    # permission_classes = [IsAuthenticated, IsUserOrAdmin]
    
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    def perform_create(self, serializer):
        # serializer.save(author=self.request.user)
        serializer.save() # This is for testing purposes only.
        

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes = [IsAuthenticated, IsUserOrAdmin]
    
    def get_queryset(self):
        # return Post.objects.filter(author=self.request.user)
        return Post.objects.all() # This is for testing purposes only.
