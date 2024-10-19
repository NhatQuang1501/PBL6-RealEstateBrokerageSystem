from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from accounts.enums import *
from rest_framework.response import Response


class EnumView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        estate_type_enum = EstateType.get_choices_display()
        orientation_enum = Orientation.get_choices_display()
        legal_status_enum = Legal_status.get_choices_display()
        sale_status_enum = Sale_status.get_choices_display()
        status_enum = Status.get_choices_display()

        return Response(
            {"estate_type_enum": estate_type_enum},
            {"orientation_enum": orientation_enum},
            {"legal_status_num": legal_status_enum},
            {"sale_status_enum": sale_status_enum},
            {"status_enum": status_enum},
        )
