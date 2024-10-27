from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from accounts.enums import *
from rest_framework.response import Response


class EnumView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        friendrequest_enum = FriendRequest_status.get_choices_display()

        return Response(
            {"friendrequest_enum": friendrequest_enum},
        )
