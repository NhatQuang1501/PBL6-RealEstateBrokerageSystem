from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.permission import IsUser
from accounts.serializers import UserSerializer


class HomeView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get(self, request):
        user = request.user
        user_serializer = UserSerializer(user)
        return Response(
            {"message": "Welcome to Sweet Home!", "user": user_serializer.data},
            status=200,
        )
