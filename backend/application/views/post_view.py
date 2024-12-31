from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from application.models import *
from application.serializers.post_serializer import *
from application.utils import PostGetter
from application.recommendation.hybrid_filtering import hybrid_filtering
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permission import *
from accounts.models import *
from accounts.serializers import *
from django.shortcuts import get_object_or_404
from django.utils import timezone
from application.utils import *
import time
from django.db.models import Q, Count, F
import unicodedata
import re
from datetime import timedelta
from notification.notification_service import NotificationService


class PostView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    def get(self, request, pk=None):
        params = {key.strip(): value for key, value in request.query_params.items()}
        category = params.get("category", "").strip() if params.get("category") else ""

        if pk:
            if User.objects.filter(user_id=pk).exists():
                user = get_object_or_404(User.objects.only("user_id"), user_id=pk)
                posts = (
                    Post.objects.filter(user_id=user, status=Status.APPROVED)
                    .select_related("user_id")
                    .order_by("-created_at")
                )
                post_serializer = PostSerializer(
                    posts, many=True, context={"request_type": "detail"}
                )

                return Response(
                    post_serializer.data,
                    status=status.HTTP_200_OK,
                )

            elif Post.objects.filter(post_id=pk).exists():
                post = get_object_or_404(
                    Post.objects.select_related("user_id"), post_id=pk
                )
                post.view_count = F("view_count") + 1
                post.save(update_fields=["view_count"])
                post.refresh_from_db()
                post_serializer = PostSerializer(
                    post, context={"request_type": "detail"}
                )

                return Response(post_serializer.data, status=status.HTTP_200_OK)

            else:
                return Response(
                    {"message": f"Không có bài đăng với user_id hay post_id là {pk}"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        else:
            query = Q(status=Status.APPROVED)
            if category == "oldest posts":
                posts = (
                    Post.objects.filter(query)
                    .select_related("user_id")
                    .order_by("created_at")
                )
            elif category == "house":
                query &= Q(estate_type=EstateType.HOUSE)
                posts = (
                    Post.objects.filter(query)
                    .select_related("user_id")
                    .order_by("-created_at")
                )
            elif category == "land":
                query &= Q(estate_type=EstateType.LAND)
                posts = (
                    Post.objects.filter(query)
                    .select_related("user_id")
                    .order_by("-created_at")
                )
            elif category == "popular":
                recent_months = 6
                current_date = timezone.now()
                start_date = current_date - timedelta(days=recent_months * 30)
                posts = (
                    Post.objects.filter(
                        status=Status.APPROVED, created_at__gte=start_date
                    )
                    .annotate(
                        reaction_count=Count("postreaction"),
                        comment_count=Count("postcomment"),
                        popular_score=(
                            0.3 * Count("postreaction")
                            + 0.7 * Count("postcomment")
                            + 0.1 * F("view_count")
                            + 1.0 * F("save_count")
                        ),
                    )
                    .order_by("-popular_score", "-created_at")
                )
            else:
                posts = (
                    Post.objects.filter(query)
                    .select_related("user_id")
                    .order_by("-created_at")
                )

            post_serializer = PostSerializer(
                posts, many=True, context={"request_type": "list"}
            )
            return Response(post_serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        post_data = request.data.copy()
        post_data["user_id"] = request.user.user_id
        author = request.user

        decimal_fields = [
            "area",
            "length",
            "width",
            "frontage",
            "longitude",
            "latitude",
            "highest_offer_price",
        ]
        for field in decimal_fields:
            if post_data.get(field) == "":
                post_data[field] = None

        post_serializer = PostSerializer(data=post_data)

        if post_serializer.is_valid():
            post_serializer.save()

            admins = User.objects.filter(role=Role.ADMIN)
            for admin in admins:
                admin_noti = f"{author.username} đã tạo bài đăng mới"
                author_id = author.user_id
                author_avatar = (
                    author.profile.avatar.url if author.profile.avatar else None
                )
                additional_info = {
                    "type": NotificationType.POST,
                    "author_id": str(author_id),
                    "author_avatar": author_avatar,
                    "post_id": str(post_serializer.data["post_id"]),
                }
                NotificationService.add_notification(admin, admin_noti, additional_info)

            author_noti = "Bạn đã tạo bài đăng thành công, đang chờ duyệt bởi admin"
            NotificationService.add_notification(author, author_noti, additional_info)

            return Response(
                {"message": "Tạo bài đăng thành công", "data": post_serializer.data},
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {"message": "Tạo bài đăng thất bại", "error": post_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request, pk):
        post = get_object_or_404(Post.objects.select_related("user_id"), post_id=pk)
        author = request.user

        if post.user_id != request.user:
            return Response(
                {"message": "Bạn không có quyền cập nhật bài đăng này"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if post.sale_status in [
            Sale_status.NEGOTIATING,
            Sale_status.DEPOSITED,
            Sale_status.SOLD,
        ]:
            return Response(
                {
                    "message": "Bài đăng không thể cập nhật khi đang ở trạng thái đã thương lượng, đã cọc hoặc đã bán"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        post_data = request.data.copy()
        decimal_fields = [
            "area",
            "length",
            "width",
            "frontage",
            "longitude",
            "latitude",
            "highest_offer_price",
        ]
        for field in decimal_fields:
            if post_data.get(field) == "":
                post_data[field] = None

        post_serializer = PostSerializer(post, data=post_data, partial=True)

        if post_serializer.is_valid():
            post_serializer.save()

            admins = User.objects.filter(role=Role.ADMIN)
            for admin in admins:
                admin_noti = f"{author.username} đã chỉnh sửa 1 bài đăng"
                author_id = author.user_id
                author_avatar = (
                    author.profile.avatar.url if author.profile.avatar else None
                )
                additional_info = {
                    "type": NotificationType.POST,
                    "author_id": str(author_id),
                    "author_avatar": author_avatar,
                    "post_id": str(post_serializer.data["post_id"]),
                }
                NotificationService.add_notification(admin, admin_noti, additional_info)

            author_noti = f"Bạn đã chỉnh sửa 1 bài đăng, đang chờ duyệt bởi admin"
            NotificationService.add_notification(author, author_noti, additional_info)

            return Response(
                {
                    "message": "Cập nhật bài đăng thành công",
                    "data": post_serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"message": "Cập nhật bài đăng thất bại", "error": post_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):
        post = get_object_or_404(
            Post.objects.select_related("user_id").only("post_id", "title", "user_id"),
            post_id=pk,
        )
        post.delete()

        return Response(
            {"message": "Xoá bài đăng thành công"}, status=status.HTTP_200_OK
        )


class PendingPostView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        # Cho phép mọi người truy cập GET, nhưng yêu cầu xác thực cho các phương thức khác
        if self.request.method == "GET":
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    def get(self, request, pk=None):
        if pk:
            # Kiểm tra nếu `pk` là `user_id` của user
            if User.objects.filter(user_id=pk).exists():
                user = get_object_or_404(User.objects.only("user_id"), user_id=pk)
                posts = (
                    Post.objects.filter(user_id=user, status=Status.PENDING_APPROVAL)
                    .select_related("user_id")
                    .order_by("-created_at")
                )
                post_serializer = PostSerializer(
                    posts, many=True, context={"request_type": "detail"}
                )

                return Response(post_serializer.data, status=status.HTTP_200_OK)

            # Kiểm tra nếu `pk` là `post_id` của bài đăng
            elif Post.objects.filter(
                post_id=pk, status=Status.PENDING_APPROVAL
            ).exists():
                post = get_object_or_404(
                    Post.objects.select_related("user_id"), post_id=pk
                )
                post.view_count = F("view_count") + 1
                post.save(update_fields=["view_count"])
                post_serializer = PostSerializer(
                    post, context={"request_type": "detail"}
                )
                return Response(post_serializer.data, status=status.HTTP_200_OK)

            else:
                return Response(
                    {
                        "message": f"Không có bài đăng đang chờ duyệt với user_id hay post_id là {pk}"
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

        else:
            # Lấy tất cả bài đăng đang chờ duyệt
            posts = (
                Post.objects.filter(status=Status.PENDING_APPROVAL)
                .select_related("user_id")
                .order_by("-created_at")
            )
            post_serializer = PostSerializer(
                posts, many=True, context={"request_type": "list"}
            )
            return Response(post_serializer.data, status=status.HTTP_200_OK)


class SearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        start_time = time.time()
        params = {key.strip(): value for key, value in request.query_params.items()}
        text = params.get("text", "").strip()

        if not text:
            text = request.data.get("text", "").strip()
            print("Text trong request data:", text)

        # Sử dụng select_related để giảm số lượng truy vấn khi truy cập các đối tượng liên quan
        posts = Post.objects.select_related("user_id").all().order_by("-created_at")
        result = []

        def matches_text(field_value):
            return self.remove_accents(text) in self.remove_accents(field_value)

        for post in posts.iterator():
            if any(
                (
                    matches_text(post.title),
                    matches_text(post.estate_type),
                    matches_text(str(post.price)),
                    matches_text(post.city),
                    matches_text(post.district),
                    matches_text(post.ward),
                    matches_text(post.street),
                    matches_text(post.address),
                    matches_text(post.orientation),
                    matches_text(post.land_lot),
                    matches_text(post.map_sheet_number),
                    matches_text(post.land_parcel),
                    matches_text(str(post.area)),
                    matches_text(str(post.length)),
                    matches_text(str(post.width)),
                    matches_text(str(post.frontage)),
                    matches_text(str(post.bedroom)),
                    matches_text(str(post.bathroom)),
                    matches_text(str(post.floor)),
                    matches_text(str(post.longitude)),
                    matches_text(str(post.latitude)),
                    matches_text(post.legal_status),
                    matches_text(post.sale_status),
                    matches_text(post.description),
                    self.search_in_profile(text, post),
                )
            ):
                result.append(PostSerializer(post).data)

        print("time: ", time.time() - start_time)
        return Response(result, status=status.HTTP_200_OK)

    @staticmethod
    def remove_accents(text):
        text = str(text)
        text = unicodedata.normalize("NFD", text)
        text = re.sub(r"[\u0300-\u036f]", "", text)
        return text.lower()

    @staticmethod
    def search_in_profile(text, post):
        user_info = post.user_id.profile if hasattr(post.user_id, "profile") else {}
        fullname = user_info.fullname if user_info else ""
        return SearchView.remove_accents(text) in SearchView.remove_accents(fullname)


class PostCommentView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        # Cho phép mọi người truy cập GET, nhưng yêu cầu xác thực cho các phương thức khác
        if self.request.method == "GET":
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    def get(self, request, pk):
        post = get_object_or_404(Post, post_id=pk)
        comments = PostComment.objects.filter(post_id=post).select_related("user_id")
        comment_serializer = PostCommentSerializer(comments, many=True)

        # bỏ bớt trường post_id
        for comment in comment_serializer.data:
            comment.pop("post_id")

        return Response(comment_serializer.data, status=status.HTTP_200_OK)

    def post(self, request, pk):
        post = get_object_or_404(Post, post_id=pk)
        comment_data = request.data.copy()
        comment_data["user_id"] = request.user.user_id
        comment_data["post_id"] = pk
        comment_serializer = PostCommentSerializer(data=comment_data)

        if comment_serializer.is_valid():
            comment_serializer.save()

            return Response(
                {
                    "message": "Tạo bình luận thành công",
                    "data": comment_serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "message": "Tạo bình luận thất bại",
                "error": comment_serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class PostReactionView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        # Cho phép mọi người truy cập GET, nhưng yêu cầu xác thực cho các phương thức khác
        if self.request.method == "GET":
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    def post(self, request, pk):
        post = get_object_or_404(Post, post_id=pk)
        # kiểm tra xem user đó đã reaction post hiện tại chưa, nếu chưa thì tạo query mới, nếu rồi thì xoá query cũ
        reaction, created = PostReaction.objects.get_or_create(
            post_id=post, user_id=request.user, defaults={"reaction_type": 1}
        )

        if not created:  # Đã tồn tại, nên hủy like
            reaction.delete()
            return Response({"detail": "Unliked"}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Liked"}, status=status.HTTP_201_CREATED)


class UserPostReactionView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get(self, request):
        user = request.user.user_id
        reactions = PostReaction.objects.filter(user_id=user).select_related("post_id")
        reaction_serializer = PostReactionSerializer(reactions, many=True)

        return Response(reaction_serializer.data, status=status.HTTP_200_OK)


class PostImageView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        # Cho phép mọi người truy cập GET, nhưng yêu cầu xác thực cho các phương thức khác
        if self.request.method == "GET":
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    def get(self, request, pk):
        post = get_object_or_404(Post.objects.select_related("user_id"), post_id=pk)
        images = PostImage.objects.filter(post_id=post).iterator()
        image_serializer = PostImageSerializer(images, many=True)

        return Response(image_serializer.data, status=status.HTTP_200_OK)

    def post(self, request, pk):
        list_images = request.data.getlist("image")
        image_data_list = [{"post_id": pk, "image": image} for image in list_images]
        image_serializer = PostImageSerializer(data=image_data_list, many=True)

        if image_serializer.is_valid():
            image_serializer.save()
            return Response(
                {"message": "Tạo ảnh thành công"}, status=status.HTTP_201_CREATED
            )
        return Response(
            {"message": "Tạo ảnh thất bại", "error": image_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request, pk):
        post = get_object_or_404(Post.objects.select_related("user_id"), post_id=pk)

        if post.sale_status in [
            Sale_status.NEGOTIATING,
            Sale_status.DEPOSITED,
            Sale_status.SOLD,
        ]:
            return Response(
                {
                    "message": "Ảnh bài đăng không thể cập nhật khi đang ở trạng thái đã thương lượng, đã cọc hoặc đã bán"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        PostImage.objects.filter(post_id=post).delete()
        list_images = request.data.getlist("image")
        image_data_list = [{"post_id": pk, "image": image} for image in list_images]
        image_serializer = PostImageSerializer(data=image_data_list, many=True)

        if image_serializer.is_valid():
            image_serializer.save()
            return Response(
                {"message": "Cập nhật ảnh thành công"}, status=status.HTTP_200_OK
            )
        return Response(
            {"message": "Cập nhật ảnh thất bại", "error": image_serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):
        post = get_object_or_404(Post.objects.select_related("user_id"), post_id=pk)
        PostImage.objects.filter(post_id=post).delete()

        return Response({"message": "Xoá ảnh thành công"}, status=status.HTTP_200_OK)


class MarkPostAsSoldView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]

        return [permission() for permission in self.permission_classes]

    def get(self, request):
        sold_posts = (
            Post.objects.filter(user_id=request.user, sale_status=Sale_status.SOLD)
            .select_related("user_id")
            .order_by("-created_at")
        )
        sold_post_serializer = PostSerializer(sold_posts, many=True)

        return Response(
            sold_post_serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request, post_id):
        sale_status = request.data.get("sale_status")
        sale_status = Sale_status.map_display_to_value(sale_status)

        post = get_object_or_404(
            Post.objects.select_related("user_id"), post_id=post_id
        )

        # Kiểm tra xem người dùng có phải là người đăng bài không
        if str(post.user_id_id) != str(request.user.user_id):
            return Response(
                {"message": "Bạn không có quyền sửa bài đăng này"},
                status=status.HTTP_403_FORBIDDEN,
            )

        post.sale_status = sale_status

        if sale_status == Sale_status.SOLD:
            post.save()
            serializer = PostSerializer(post)

            return Response(
                {
                    "message": "Bài đăng đã bán thành công",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        else:
            return Response(
                {"error": "Hành động không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST
            )


class RecommendedPostView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get(self, request):
        user_id = request.user.user_id

        try:
            num_recommendations = int(
                request.query_params.get("num_recommendations", 10)
            )
        except ValueError:
            return Response(
                {"message": "num_recommendations phải là một số nguyên"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if num_recommendations <= 0:
            return Response(
                {"message": "num_recommendations phải lớn hơn 0"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Gọi hàm lọc đề xuất
        recommended_posts = hybrid_filtering(user_id, num_recommendations)
        serializer = PostSerializer(recommended_posts, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
