from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from application.models import *
from application.serializers import *
from application.utils import PostGetter
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permission import *
from accounts.models import *
from accounts.serializers import *
from django.db import transaction
from django.core.paginator import Paginator
from django.core.paginator import EmptyPage
from django.core.paginator import PageNotAnInteger
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from application.utils import *
from django.db.models import Q
from decimal import Decimal


# Tất cả thương lượng
class NegotiationsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, negotiation_id=None):
        if negotiation_id is not None:
            negotiation = get_object_or_404(Negotiation, negotiation_id=negotiation_id)
            serializer = NegotiationSerializer(negotiation)

            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            negotiations = (
                Negotiation.objects.select_related("post").all().order_by("-created_at")
            )
            grouped_data = {}

            for negotiation in negotiations:
                post_id = negotiation.post.post_id

                if post_id not in grouped_data:
                    grouped_data[post_id] = {
                        "count": 0,
                        "post_id": post_id,
                        "negotiations": [],
                    }
                grouped_data[post_id]["negotiations"].append(
                    NegotiationSerializer(negotiation).data
                )
                grouped_data[post_id]["count"] += 1

            return Response(list(grouped_data.values()), status=status.HTTP_200_OK)


# Danh sách thương lượng mà user là người thương lượng
class UserNegotiationsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get(self, request, negotiation_id=None):
        if negotiation_id:
            negotiation = get_object_or_404(Negotiation, negotiation_id=negotiation_id)
            serializer = NegotiationSerializer(negotiation)

            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            negotiations = Negotiation.objects.filter(user=request.user).order_by(
                "-created_at"
            )
            serializer = NegotiationSerializer(negotiations, many=True)

            return Response(
                {"count": negotiations.count(), "negotiations": serializer.data},
                status=status.HTTP_200_OK,
            )


# List và Detail thương lượng trên các bài đăng của user
class PostNegotiationsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get(self, request, post_id=None):
        if post_id:
            post = get_object_or_404(Post, post_id=post_id)
            negotiations = Negotiation.objects.filter(post=post).order_by("-created_at")
            serializer = NegotiationSerializer(negotiations, many=True)

            return Response(
                {"count": negotiations.count(), "negotiations": serializer.data},
                status=status.HTTP_200_OK,
            )

        else:
            posts = Post.objects.filter(user_id=request.user.user_id).order_by(
                "-created_at"
            )
            negotiations = (
                Negotiation.objects.filter(post__in=posts)
                .select_related("post")
                .order_by("-created_at")
            )

            grouped_data = {}
            for negotiation in negotiations:
                post_id = negotiation.post.post_id
                if post_id not in grouped_data:
                    grouped_data[post_id] = {
                        "count": 0,  # Đếm số thương lượng trên bài đăng này
                        "post_id": post_id,
                        "post_title": negotiation.post.title,
                        "negotiations": [],
                    }
                grouped_data[post_id]["negotiations"].append(
                    NegotiationSerializer(negotiation).data
                )
                grouped_data[post_id]["count"] += 1  # Tăng đếm số lượng

            return Response(list(grouped_data.values()), status=status.HTTP_200_OK)

    def post(self, request, post_id):
        post = get_object_or_404(Post, post_id=post_id)

        # Kiểm tra xem người dùng có phải là người đăng bài không
        if str(post.user_id_id) == str(request.user.user_id):
            return Response(
                {
                    "message": "Bạn không thể tự thương lượng với bài đăng của chính mình"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Kiểm tra trạng thái bài đăng
        if post.status != Status.APPROVED or post.sale_status not in [
            Sale_status.SELLING,
            Sale_status.NEGOTIATING,
        ]:
            return Response(
                {"message": "Không thể thực hiện thương lượng cho bài đăng này"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Giá trị offer phải không nhỏ hơn 70% giá gốc
        offer_price = Decimal(request.data.get("offer_price", post.price))
        min_offer_percentage = Decimal("0.7")
        min_offer_price = post.price * min_offer_percentage

        # Kiểm tra giới hạn giá offer
        if offer_price < min_offer_price:
            return Response(
                {
                    "message": "Giá offer không hợp lệ",
                    "detail": f"Giá offer phải ít nhất là {min_offer_percentage * 100}% so với giá gốc {post.price}: {min_offer_price} VND",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Xóa thương lượng cũ của người dùng cho bài đăng này nếu tồn tại
        with transaction.atomic():
            Negotiation.objects.filter(post=post, user=request.user).delete()

            # Tạo thương lượng mới
            negotiation = Negotiation.objects.create(
                post=post, user=request.user, offer_price=offer_price
            )

            # Cập nhật trạng thái bài đăng nếu cần
            if offer_price >= post.highest_offer_price:
                post.highest_offer_price = offer_price
                post.highest_offer_user = request.user
                post.sale_status = Sale_status.NEGOTIATING
                post.save()

        serializer = NegotiationSerializer(negotiation)

        return Response(
            {
                "message": "Thương lượng mới được tạo thành công",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


# Chấp nhận hoặc từ chối thương lượng
class AcceptNegotiationView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    def get(self, request, negotiation_id):
        if negotiation_id:
            negotiation = get_object_or_404(Negotiation, negotiation_id=negotiation_id)
            if negotiation.accepted:
                return Response(
                    {"message": "Thương lượng này đã được chấp nhận."},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"message": "Thương lượng này chưa được chấp nhận."},
                status=status.HTTP_200_OK,
            )

        else:
            return Response(
                {"message": "Không tìm thấy thương lượng."},
                status=status.HTTP_404_NOT_FOUND,
            )

    def post(self, request):
        negotiation_id = request.data.get("negotiation_id")
        is_accepted = request.data.get("is_accepted", False)

        if not negotiation_id or is_accepted is None:
            return Response(
                {
                    "error": "Thiếu negotiation_id hoặc is_accepted trong request",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Lấy thương lượng từ negotiation_id
        negotiation = get_object_or_404(Negotiation, negotiation_id=negotiation_id)
        post = negotiation.post

        # Kiểm tra trạng thái bài đăng
        if post.status != Status.APPROVED or post.sale_status not in [
            Sale_status.NEGOTIATING,
        ]:
            return Response(
                {"message": "Không thể chấp nhận thương lượng cho bài đăng này"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Kiểm tra user có phải là người đăng bài không
        if post.user_id != request.user:
            return Response(
                {"message": "Bạn không có quyền chấp nhận thương lượng này."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Chấp nhận thương lượng
        if is_accepted:
            post.sale_status = Sale_status.DEPOSITED
            post.price = negotiation.offer_price
            post.save()

            negotiation.is_accepted = True
            negotiation.save()

            Negotiation.objects.filter(post=post, is_accepted=False).update(
                is_accepted=False
            )

            return Response(
                {
                    "message": "Thương lượng đã được chấp nhận và bài đăng chuyển sang trạng thái đã cọc",
                    "data": NegotiationSerializer(negotiation).data,
                },
                status=status.HTTP_200_OK,
            )
        else:
            # Không chấp nhận thương lượng
            negotiation.is_accepted = False
            negotiation.save()

            return Response(
                {"message": "Thương lượng đã được từ chối"},
                status=status.HTTP_200_OK,
            )
