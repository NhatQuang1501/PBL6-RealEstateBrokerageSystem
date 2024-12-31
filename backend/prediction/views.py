from django.shortcuts import render
import joblib
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import *
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "AI", "random_forest_model.pkl")
ENCODING_WARD_PATH = os.path.join(BASE_DIR, "AI", "mean_target_by_ward.csv")

rf_model = joblib.load(MODEL_PATH)
encoding_ward_df = pd.read_csv(ENCODING_WARD_PATH)
encoding_ward = encoding_ward_df.set_index("ward")["mean_price_m2"].to_dict()


def predict_price(
    area,
    width,
    length,
    ward,
    has_frontage,
    has_car_lane,
    has_rear_expansion,
    orientation,
):
    df = pd.DataFrame(
        {
            "area": [area],
            "width": [width],
            "length": [length],
            "has_frontage": [has_frontage],
            "has_car_lane": [has_car_lane],
            "has_rear_expansion": [has_rear_expansion],
            "direction_Bắc": [1 if "Bắc" in orientation else 0],
            "direction_Nam": [1 if "Nam" in orientation else 0],
            "direction_Tây": [1 if "Tây" in orientation else 0],
            "direction_Đông": [1 if "Đông" in orientation else 0],
            "ward_avg_price": [ward],
        }
    )
    df["ward_avg_price"] = df["ward_avg_price"].map(encoding_ward)
    return rf_model.predict(df)[0]


class PredictPriceView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        required_fields = [
            "area",
            "width",
            "length",
            "ward",
            "has_frontage",
            "has_car_lane",
            "has_rear_expansion",
            "orientation",
        ]
        for field in required_fields:
            if field not in serializer.validated_data:
                return Response(
                    {"error": f"Missing {field}"}, status=status.HTTP_400_BAD_REQUEST
                )

        if serializer.validated_data["ward"] not in encoding_ward:
            return Response(
                {"error": "Ward not found in the database"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        area = serializer.validated_data["area"]

        price_m2 = predict_price(
            area=serializer.validated_data["area"],
            width=serializer.validated_data["width"],
            length=serializer.validated_data["length"],
            ward=serializer.validated_data["ward"],
            has_frontage=serializer.validated_data["has_frontage"],
            has_car_lane=serializer.validated_data["has_car_lane"],
            has_rear_expansion=serializer.validated_data["has_rear_expansion"],
            orientation=serializer.validated_data["orientation"],
        )
        price = int(price_m2 * area * 1000000)
        return Response({"predicted_price": price}, status=status.HTTP_200_OK)


MODEL_PATH_NHA = os.path.join(BASE_DIR, "AI", "random_forest_model_nha.pkl")
ENCODING_WARD_PATH_NHA = os.path.join(BASE_DIR, "AI", "mean_target_by_ward_nha.csv")
STREET_INFO_PATH = os.path.join(BASE_DIR, "AI", "danang_street_gov_clean2.csv")

rf_model_nha = joblib.load(MODEL_PATH_NHA)
encoding_ward_df_nha = pd.read_csv(ENCODING_WARD_PATH_NHA)
encoding_ward_nha = encoding_ward_df.set_index("ward")["mean_price_m2"].to_dict()
street_info_df = pd.read_csv(STREET_INFO_PATH)
# street_info_df = street_info_df.loc[:, ~street_info_df.columns.duplicated()]
street_dict = street_info_df.set_index("street").T.to_dict()


def predict_price_house(
    area,
    floors,
    rooms,
    toilets,
    house_type,
    furnishing_sell,
    living_size,
    width,
    length,
    orientation,
    street,
    ward,
):
    df = pd.DataFrame(
        {
            "area": [area],
            "floors": [floors],
            "rooms": [rooms],
            "toilets": [toilets],
            "house_type": [int(house_type)],
            "furnishing_sell": [int(furnishing_sell)],
            "living_size": [living_size],
            "width": [width],
            "length": [length],
            "direction_Bắc": [1 if "Bắc" in orientation else 0],
            "direction_Nam": [1 if "Nam" in orientation else 0],
            "direction_Tây": [1 if "Tây" in orientation else 0],
            "direction_Đông": [1 if "Đông" in orientation else 0],
            "street_length": street_dict[street]["length"],
            "street_width": street_dict[street]["width"],
            "street_sidewalk": street_dict[street]["sidewalk"],
            "ward_avg_price": [ward],
        }
    )
    df["ward_avg_price"] = df["ward_avg_price"].map(encoding_ward_nha)
    return rf_model_nha.predict(df)[0]


class PredictHousePriceView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = HousePredictionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        required_fields = [
            "area",
            "floors",
            "rooms",
            "toilets",
            "house_type",
            "furnishing_sell",
            "living_size",
            "width",
            "length",
            "orientation",
            "street",
            "ward",
        ]
        for field in required_fields:
            if field not in serializer.validated_data:
                return Response(
                    {"error": f"Missing {field}"}, status=status.HTTP_400_BAD_REQUEST
                )

        street = serializer.validated_data["street"].lower()
        if street not in street_dict:
            return Response(
                {"error": "Street not found in the database"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        ward = serializer.validated_data["ward"]
        if ward not in encoding_ward_nha:
            return Response(
                {"error": "Ward not found in the database"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        price = predict_price_house(
            area=serializer.validated_data["area"],
            floors=serializer.validated_data["floors"],
            rooms=serializer.validated_data["rooms"],
            toilets=serializer.validated_data["toilets"],
            house_type=serializer.validated_data["house_type"],
            furnishing_sell=serializer.validated_data["furnishing_sell"],
            living_size=serializer.validated_data["living_size"],
            width=serializer.validated_data["width"],
            length=serializer.validated_data["length"],
            orientation=serializer.validated_data["orientation"],
            street=street,
            ward=serializer.validated_data["ward"],
        )
        price = int(price * 1000000000)
        return Response({"predicted_price": price}, status=status.HTTP_200_OK)
