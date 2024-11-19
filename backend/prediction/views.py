from django.shortcuts import render
import joblib
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import PredictionInputSerializer
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, 'AI', 'random_forest_model.pkl')
ENCODING_WARD_PATH = os.path.join(BASE_DIR, 'AI', 'mean_target_by_ward.csv')

rf_model = joblib.load(MODEL_PATH)
encoding_ward_df = pd.read_csv(ENCODING_WARD_PATH)
encoding_ward = encoding_ward_df.set_index('ward')['mean_price_m2'].to_dict()

def predict_price(area, width, length, ward, has_frontage, has_car_lane, has_rear_expansion, orientation):
    df = pd.DataFrame({
        'area': [area],
        'width': [width],
        'length': [length],
        'has_frontage': [has_frontage],
        'has_car_lane': [has_car_lane],
        'has_rear_expansion': [has_rear_expansion],
        'direction_Bắc': [1 if 'Bắc' in orientation else 0],
        'direction_Nam': [1 if 'Nam' in orientation else 0],
        'direction_Tây': [1 if 'Tây' in orientation else 0],
        'direction_Đông': [1 if 'Đông' in orientation else 0],
        'ward_avg_price': [ward],
    })
    df['ward_avg_price'] = df['ward_avg_price'].map(encoding_ward)
    return rf_model.predict(df)[0]

class PredictPriceView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # kiểm tra xem dữ liệu đầu vào có đầy đủ không
        if 'area' not in serializer.validated_data:
            return Response({'error': 'Missing area'}, status=status.HTTP_400_BAD_REQUEST)
        if 'width' not in serializer.validated_data:
            return Response({'error': 'Missing width'}, status=status.HTTP_400_BAD_REQUEST)
        if 'length' not in serializer.validated_data:
            return Response({'error': 'Missing length'}, status=status.HTTP_400_BAD_REQUEST)
        if 'ward' not in serializer.validated_data:
            return Response({'error': 'Missing ward'}, status=status.HTTP_400_BAD_REQUEST)
        if 'has_frontage' not in serializer.validated_data:
            return Response({'error': 'Missing has_frontage'}, status=status.HTTP_400_BAD_REQUEST)
        if 'has_car_lane' not in serializer.validated_data:
            return Response({'error': 'Missing has_car_lane'}, status=status.HTTP_400_BAD_REQUEST)
        if 'has_rear_expansion' not in serializer.validated_data:
            return Response({'error': 'Missing has_rear_expansion'}, status=status.HTTP_400_BAD_REQUEST)
        if 'orientation' not in serializer.validated_data:
            return Response({'error': 'Missing orientation'}, status=status.HTTP_400_BAD_REQUEST)
        

        area = serializer.validated_data['area']
        
        price_m2 = predict_price(
            area=serializer.validated_data['area'],
            width=serializer.validated_data['width'],
            length=serializer.validated_data['length'],
            ward=serializer.validated_data['ward'],
            has_frontage=serializer.validated_data['has_frontage'],
            has_car_lane=serializer.validated_data['has_car_lane'],
            has_rear_expansion=serializer.validated_data['has_rear_expansion'],
            orientation=serializer.validated_data['orientation']
        )
        price = int(price_m2 * area * 1000000)
        return Response({'predicted_price': price}, status=status.HTTP_200_OK)

