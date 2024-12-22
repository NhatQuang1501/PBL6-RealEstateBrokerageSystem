from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from application.models import *
from application.serializers.negotiation_serrializer import *
from application.serializers.post_serializer import *
from application.utils import PostGetter
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permission import *
from accounts.models import *
from accounts.serializers import *
from chatting.models import *
from chatting.serializers import *
from django.db import transaction
from django.shortcuts import get_object_or_404
from application.utils import *
from django.db.models import Q
from decimal import Decimal
from notification.notification_service import NotificationService


class NegotiationsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, negotiation_id=None):
        if negotiation_id:
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


class UserNegotiationsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get(self, request, negotiation_id=None):
        user = request.user
        negotiation_type = request.query_params.get("type", "").lower()

        if negotiation_id:
            negotiation = get_object_or_404(Negotiation, negotiation_id=negotiation_id)
            if negotiation.user != user and negotiation.post.user_id != user:
                return Response(
                    {"message": "Bạn không có quyền xem chi tiết thương lượng này"},
                    status=status.HTTP_403_FORBIDDEN,
                )
            post = negotiation.post
            serializer = PostSerializer(post)

            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            if negotiation_type == "author":
                authored_posts = Post.objects.filter(user_id=user)
                negotiations = Negotiation.objects.filter(
                    post__in=authored_posts
                ).order_by("-created_at")
            else:
                negotiations = Negotiation.objects.filter(user=user).order_by(
                    "-created_at"
                )

            posts = {negotiation.post for negotiation in negotiations}
            serializer = PostSerializer(list(posts), many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)


# List và Detail thương lượng trên các bài đăng của user
class PostNegotiationsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get(self, request, post_id=None):
        params = {key.strip(): value for key, value in request.query_params.items()}
        sort_by = params.get("sort_by")
        order = params.get("order", "desc")
        amount = params.get("amount", None)

        if post_id:
            post = get_object_or_404(Post, post_id=post_id)
            negotiations = Negotiation.objects.filter(post=post).select_related(
                "user__profile"
            )

            allowed_sort_fields = {
                "average_response_time": "average_response_time",
                "reputation_score": "user__profile__reputation_score",
                "successful_transactions": "user__profile__successful_transactions",
                "response_rate": "user__profile__response_rate",
                "profile_completeness": "user__profile__profile_completeness",
                "negotiation_experience": "user__profile__negotiation_experience",
            }

            if sort_by in allowed_sort_fields:
                sort_field = allowed_sort_fields[sort_by]
                if order == "desc":
                    sort_field = f"-{sort_field}"
                negotiations = negotiations.order_by(sort_field)

            else:
                negotiations = negotiations.order_by(
                    f"{'-' if order == 'desc' else ''}{sort_by}"
                )

            if amount:
                try:
                    amount = int(amount)
                    negotiations = negotiations[:amount]

                except ValueError:
                    return Response(
                        {"error": "amount phải là một số nguyên dương"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            serializer = NegotiationSerializer(negotiations, many=True)

            return Response(
                {
                    "message": f"Danh sách {amount if amount else 'tất cả'} thương lượng của bài {post.post_id} được sắp xếp theo {sort_by} {'giảm dần' if order == 'desc' else 'tăng dần'}",
                    "count": negotiations.count(),
                    "negotiations": serializer.data,
                },
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
                        "count": 0,  # Đếm số thương lượng của mỗi bài đăng
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
        author = post.user_id
        negotiator = request.user

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

        # Giá trị negotiation phải không nhỏ hơn 70% giá gốc
        negotiation_price = Decimal(request.data.get("negotiation_price", post.price))
        min_negotiation_percentage = Decimal("0.7")
        min_negotiation_price = post.price * min_negotiation_percentage

        # Kiểm tra giới hạn giá negotiation
        if negotiation_price < min_negotiation_price:
            return Response(
                {
                    "message": "Giá thương lượng không hợp lệ",
                    "detail": f"Giá thương lượng phải ít nhất là {min_negotiation_percentage * 100}% so với giá gốc {post.price}: {min_negotiation_price} VND",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Kiểm tra xem đề nghị đã tồn tại chưa
        existing_negotiation = Negotiation.objects.filter(
            post=post,
            user=request.user,
            negotiation_price=negotiation_price,
            negotiation_date=request.data.get("negotiation_date"),
            payment_method=request.data.get("payment_method"),
            negotiation_note=request.data.get("negotiation_note"),
        ).exists()

        if existing_negotiation:
            return Response(
                {"message": "Thương lượng này đã tồn tại"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Xóa thương lượng cũ của người dùng cho bài đăng này nếu tồn tại
        with transaction.atomic():
            Negotiation.objects.filter(post=post, user=request.user).delete()

            # Tạo thương lượng mới
            negotiation = Negotiation.objects.create(
                post=post,
                user=request.user,
                negotiation_price=negotiation_price,
                negotiation_date=request.data.get("negotiation_date"),
                payment_method=request.data.get("payment_method"),
                negotiation_note=request.data.get("negotiation_note"),
            )

            # Cập nhật trạng thái bài đăng nếu cần
            if (
                post.highest_negotiation_price is None
                or negotiation_price >= post.highest_negotiation_price
            ):
                post.highest_negotiation_price = negotiation_price
                post.highest_negotiation_user = request.user
                post.sale_status = Sale_status.NEGOTIATING
                post.save()

            # Cập nhật kinh nghiệm người dùng
            profile = get_object_or_404(UserProfile, user=negotiation.user)
            profile.negotiation_experience += 1
            profile.save()

        serializer = NegotiationSerializer(negotiation)

        # Thông báo cho người đăng bài
        author_noti = (
            f"{negotiator.username} đã gửi yêu cầu thương lượng cho bài đăng của bạn"
        )
        negotiator_id = negotiator.user_id
        negotiator_username = negotiator.username
        # avatar của người thương lượng
        negotiator_avatar = (
            negotiator.profile.avatar.url if negotiator.profile.avatar.url else None
        )
        additional_info = {
            "type": NotificationType.NEGOTIATION,
            "negotiator_id": str(negotiator_id),
            "negotiator_avatar": negotiator_avatar,
            "post_id": str(post.post_id),
            "negotiation_id": str(serializer.data["negotiation_id"]),
        }
        NotificationService.add_notification(author, author_noti, additional_info)

        return Response(
            {
                "message": "Thương lượng mới được tạo thành công",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request, negotiation_id):
        negotiation = get_object_or_404(Negotiation, negotiation_id=negotiation_id)

        # Kiểm tra xem người dùng có phải là người đăng bài không
        if negotiation.user != request.user:
            return Response(
                {"message": "Bạn không có quyền xóa thương lượng này."},
                status=status.HTTP_403_FORBIDDEN,
            )

        negotiation.delete()
        ChatRoom.objects.filter(negotiation=negotiation).delete()

        return Response(
            {"message": "Thương lượng đã bị xóa thành công"},
            status=status.HTTP_200_OK,
        )


class ProposalView(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrUser]

    def get(self, request, pk):
        if Negotiation.objects.filter(negotiation_id=pk).exists():
            negotiation = Negotiation.objects.get(negotiation_id=pk)
            proposals = Proposal.objects.filter(negotiation=negotiation).order_by(
                "-created_at"
            )
            serializer = ProposalSerializer(proposals, many=True)

            return Response(
                {
                    "message": "Danh sách đề nghị",
                    "count": proposals.count(),
                    "proposals": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        elif Proposal.objects.filter(proposal_id=pk).exists():
            proposal = Proposal.objects.get(proposal_id=pk)
            serializer = ProposalSerializer(proposal)

            return Response(
                {"message": "Chi tiết đề nghị", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

        else:
            return Response(
                {"message": "Không tìm thấy đề nghị"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def post(self, request, negotiation_id):
        negotiation = get_object_or_404(Negotiation, negotiation_id=negotiation_id)
        post = negotiation.post
        negotiator = negotiation.user
        author = post.user_id

        # Kiểm tra xem người dùng có phải là người đăng bài không
        if post.user_id != request.user:
            return Response(
                {"message": "Bạn không có quyền gửi đề nghị cho thương lượng này."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if negotiation.is_considered:
            return Response(
                {
                    "message": "Thương lượng đã được xem xét bởi người đăng bài, không thể gửi đề nghị mới"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if negotiation.is_accepted:
            return Response(
                {
                    "message": "Thương lượng đã được chấp nhận, không thể gửi đề nghị mới"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Kiểm tra xem đề nghị đã tồn tại chưa
        existing_proposal = Proposal.objects.filter(
            negotiation=negotiation,
            proposal_price=request.data.get("proposal_price"),
            proposal_date=request.data.get("proposal_date"),
            proposal_method=request.data.get("proposal_method"),
            proposal_note=request.data.get("proposal_note"),
        ).exists()

        if existing_proposal:
            return Response(
                {"message": "Đề nghị này đã tồn tại"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Tạo đề nghị mới
        proposal = Proposal.objects.create(
            negotiation=negotiation,
            user=request.user,
            proposal_price=request.data.get("proposal_price"),
            proposal_date=request.data.get("proposal_date"),
            proposal_method=request.data.get("proposal_method"),
            proposal_note=request.data.get("proposal_note"),
        )

        # Đưa đề nghị mới lên đầu danh sách
        proposals = list(
            Proposal.objects.filter(negotiation=negotiation).order_by("-created_at")
        )
        proposals.insert(0, proposal)

        serializer = ProposalSerializer(proposals, many=True)

        # Thông báo cho người thương lượng
        negotiator_noti = f"{author.username} đã gửi 1 đề nghị với thương lượng cho bạn"
        author_id = author.user_id
        author_username = author.username
        author_avatar = author.profile.avatar.url if author.profile.avatar.url else None
        additional_info = {
            "type": NotificationType.PROPOSAL,
            "author_id": str(author_id),
            "author_username": str(author_username),
            "author_avatar": author_avatar,
            "negotiation_id": str(negotiation_id),
            "proposal_id": str(serializer.data[0]["proposal_id"]),
        }
        NotificationService.add_notification(
            negotiator, negotiator_noti, additional_info
        )

        return Response(
            {
                "message": "Đề nghị đã được gửi lại thành công",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class AcceptProposalView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def post(self, request, proposal_id):
        proposal = get_object_or_404(Proposal, proposal_id=proposal_id)
        negotiation = proposal.negotiation
        post = negotiation.post
        author = post.user_id
        negotiator = negotiation.user

        # Kiểm tra xem người dùng có phải là người thương lượng không
        if negotiation.user != request.user:
            return Response(
                {"message": "Bạn không có quyền chấp nhận đề nghị này."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Kiểm tra xem người thương lượng có chấp nhận đề nghị không
        is_accepted = request.data.get("is_accepted")

        if is_accepted:
            # Cập nhật trạng thái đề nghị
            proposal.is_accepted = True
            proposal.save()

            # Cập nhật thương lượng với thông tin từ request
            negotiation.negotiation_price = request.data.get(
                "negotiation_price", negotiation.negotiation_price
            )
            negotiation.negotiation_date = request.data.get(
                "negotiation_date", negotiation.negotiation_date
            )
            negotiation.payment_method = request.data.get(
                "payment_method", negotiation.payment_method
            )
            negotiation.negotiation_note = request.data.get(
                "negotiation_note", negotiation.negotiation_note
            )
            # Tính average_response_time của các thương lượng của người dùng này
            response_times = Proposal.objects.filter(
                user=request.user, is_accepted=True
            ).values_list("created_at", flat=True)
            average_response_time = calculate_average_response_time(response_times)
            negotiation.average_response_time = average_response_time

            negotiation.save()

            if (
                post.highest_negotiation_price is None
                or negotiation.negotiation_price > post.highest_negotiation_price
            ):
                post.highest_negotiation_price = negotiation.negotiation_price
                post.highest_negotiation_user = negotiation.user
                post.save()

            serializer = NegotiationSerializer(negotiation)

            # Thông báo cho người đăng bài
            author_noti = f"{negotiator.username} đã gửi yêu cầu thương lượng mới theo lời đề nghị cho bài đăng của bạn"
            negotiator_id = negotiator.user_id
            negotiator_avatar = (
                negotiator.profile.avatar.url if negotiator.profile.avatar.url else None
            )
            additional_info = {
                "type": "accept" + NotificationType.PROPOSAL,
                "negotiator_id": str(negotiator_id),
                "negotiator_avatar": negotiator_avatar,
                "post_id": str(post.post_id),
                "proposal_id": str(proposal_id),
                "negotiation_id": str(serializer.data["negotiation_id"]),
            }
            NotificationService.add_notification(author, author_noti, additional_info)

            return Response(
                {
                    "message": f"Thương lượng đã được cập nhật theo đề nghị của người đăng bài {proposal.user}",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        else:
            return Response(
                {"message": "Đề nghị không được chấp nhận, thương lượng giữ nguyên"},
                status=status.HTTP_200_OK,
            )


class ConsideredNegotiationsView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    def get(self, request, post_id):
        post = get_object_or_404(Post, post_id=post_id)
        negotiations = Negotiation.objects.filter(
            post=post, is_considered=True
        ).order_by("-created_at")
        serializer = NegotiationSerializer(negotiations, many=True)

        return Response(
            {"count": negotiations.count(), "negotiations": serializer.data},
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        negotiation_id = request.data.get("negotiation_id")
        is_considered = request.data.get("is_considered", False)

        if not negotiation_id or is_considered is None:
            return Response(
                {
                    "error": "Thiếu negotiation_id hoặc is_considered trong request",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Lấy thương lượng từ negotiation_id
        negotiation = get_object_or_404(Negotiation, negotiation_id=negotiation_id)
        post = negotiation.post
        author = post.user_id
        negotiator = negotiation.user

        # Kiểm tra trạng thái bài đăng
        if post.status != Status.APPROVED or post.sale_status not in [
            Sale_status.SELLING,
            Sale_status.NEGOTIATING,
        ]:
            return Response(
                {"message": "Không thể xem xét thương lượng cho bài đăng này"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Kiểm tra user có phải là người đăng bài không
        if post.user_id != request.user:
            return Response(
                {"message": "Bạn không có quyền xem xét thương lượng này."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Xem xét thương lượng
        if is_considered:
            negotiation.is_considered = True
            negotiation.save()

            chatroom = ChatRoom.objects.create(
                created_by=post.user_id,
                is_private=True,
                chatroom_name=f"{post.user_id.username} & {negotiation.user.username}",
                negotiation=negotiation,
            )
            chatroom.participants.set([post.user_id, negotiation.user])
            chatroom.save()
            chatroom_serializer = ChatRoomSerializer(chatroom)

            serializer = NegotiationSerializer(negotiation)

            # Thông báo cho người thương lượng
            negotiator_noti = f"{author.username} đã xem xét thương lượng của bạn, chatroom giữa 2 người đã được tạo"
            author_id = author.user_id
            author_username = author.username
            author_avatar = (
                author.profile.avatar.url if author.profile.avatar.url else None
            )
            additional_info = {
                "type": NotificationType.CONSIDERATION,
                "author_id": str(author_id),
                "author_username": str(author_username),
                "author_avatar": author_avatar,
                "negotiation_id": str(negotiation_id),
                "chatroom_id": str(chatroom.chatroom_id),
            }
            NotificationService.add_notification(
                negotiator, negotiator_noti, additional_info
            )

            return Response(
                {
                    "message": f"Thương lượng đang được xem xét bởi người đăng bài. Đã tạo phòng chat để trao đổi giữa bạn - {post.user_id.username} và người đang thương lượng - {negotiation.user.username}",
                    "data": serializer.data,
                    "chatroom": chatroom_serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        else:
            # Không xem xét thương lượng
            negotiation.is_considered = False
            negotiation.save()

            # Xóa chatroom nếu tồn tại
            ChatRoom.objects.filter(negotiation=negotiation).delete()

            return Response(
                {"message": "Thương lượng đã bị từ chối xem xét"},
                status=status.HTTP_200_OK,
            )


# Chấp nhận hoặc từ chối thương lượng
class AcceptNegotiationView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    def get(self, request, negotiation_id=None):
        if negotiation_id:
            negotiation = get_object_or_404(Negotiation, negotiation_id=negotiation_id)
            serializer = NegotiationSerializer(negotiation)

            if negotiation.is_accepted:
                return Response(
                    {
                        "message": "Thương lượng này đã được chấp nhận",
                        "data": serializer.data,
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"message": "Thương lượng này chưa được chấp nhận"},
                status=status.HTTP_200_OK,
            )

        else:
            negotiations = Negotiation.objects.filter(
                post__user_id=request.user, is_accepted=True
            ).order_by("-created_at")
            serializer = NegotiationSerializer(negotiations, many=True)

            return Response(
                {
                    "message": "Danh sách các thương lượng đã được chấp nhận",
                    "count": negotiations.count(),
                    "negotiations": serializer.data,
                },
                status=status.HTTP_200_OK,
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

        negotiation = get_object_or_404(Negotiation, negotiation_id=negotiation_id)
        post = negotiation.post
        author = post.user_id
        negotiator = negotiation.user

        if (
            post.status != Status.APPROVED
            or post.sale_status != Sale_status.NEGOTIATING
        ):
            return Response(
                {"message": "Không thể chấp nhận thương lượng cho bài đăng này"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Kiểm tra user có phải là người đăng bài không
        if post.user_id != request.user:
            return Response(
                {"message": "Bạn không có quyền chấp nhận thương lượng này"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Chấp nhận thương lượng
        if is_accepted:
            if not negotiation.is_considered:
                return Response(
                    {
                        "message": "Chỉ có thể chấp nhận những thương lượng đã được xem xét"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            post.sale_status = Sale_status.DEPOSITED
            post.price = negotiation.negotiation_price
            post.save()

            negotiation.is_accepted = True
            negotiation.save()

            # Cập nhật số lần thương lượng thành công cho người mua và người bán
            seller_profile = UserProfile.objects.get(user=post.user_id)
            seller_profile.successful_transactions += 1
            seller_profile.reputation_score += 10
            seller_profile.save()

            buyer_profile = UserProfile.objects.get(user=negotiation.user)
            buyer_profile.successful_transactions += 1
            buyer_profile.reputation_score += 10
            buyer_profile.save()

            Negotiation.objects.filter(post=post, is_accepted=False).update(
                is_accepted=False
            )
            ChatRoom.objects.filter(negotiation=negotiation).delete()
            serializer = NegotiationSerializer(negotiation)

            # Thông báo cho người thương lượng
            negotiator_noti = f"{author.username} đã chấp nhận thương lượng của bạn"
            author_id = author.user_id
            author_username = author.username
            author_avatar = (
                author.profile.avatar.url if author.profile.avatar.url else None
            )
            additional_info = {
                "type": "accept" + NotificationType.NEGOTIATION,
                "author_id": str(author_id),
                "author_username": str(author_username),
                "author_avatar": author_avatar,
                "negotiation_id": str(negotiation_id),
            }
            NotificationService.add_notification(
                negotiator, negotiator_noti, additional_info
            )

            return Response(
                {
                    "message": "Thương lượng đã được chấp nhận, chatroom trao đổi đã bị xóa và bài đăng chuyển sang trạng thái đã cọc",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        else:
            # Không chấp nhận thương lượng
            negotiation.is_accepted = False
            negotiation.save()

            ChatRoom.objects.filter(negotiation=negotiation).delete()

            return Response(
                {"message": "Thương lượng đã bị từ chối"},
                status=status.HTTP_200_OK,
            )
