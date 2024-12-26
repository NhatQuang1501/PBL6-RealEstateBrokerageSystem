from django.urls import path
from prediction.views import *

urlpatterns = [
    path("predict-price/", PredictPriceView.as_view(), name="predict-price"),
    path("predict-house-price/", PredictHousePriceView.as_view(), name="predict-house-price"),
]