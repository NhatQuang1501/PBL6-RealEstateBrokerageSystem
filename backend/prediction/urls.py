from django.urls import path

from prediction.views import PredictPriceView

urlpatterns = [
    path("predict-price/", PredictPriceView.as_view(), name="predict-price"),
]