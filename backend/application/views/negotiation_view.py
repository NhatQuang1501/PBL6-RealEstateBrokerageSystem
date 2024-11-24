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

        serializer = NegotiationSerializer(negotiation)

        return Response(
            {
                "message": "Thương lượng mới được tạo thành công",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
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
                {"message": "Đề nghị chi tiết", "data": serializer.data},
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

        # Kiểm tra xem người dùng có phải là người đăng bài không
        if post.user_id != request.user:
            return Response(
                {"message": "Bạn không có quyền gửi đề nghị cho thương lượng này."},
                status=status.HTTP_403_FORBIDDEN,
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
                {"message": "Đề nghị này đã tồn tại."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Tạo đề nghị mới
        with transaction.atomic():
            proposal = Proposal.objects.create(
                negotiation=negotiation,
                user=request.user,
                proposal_price=request.data.get("proposal_price"),
                proposal_date=request.data.get("proposal_date"),
                proposal_method=request.data.get("proposal_method"),
                proposal_note=request.data.get("proposal_note"),
            )

        serializer = ProposalSerializer(proposal)

        return Response(
            {
                "message": "Đề nghị đã được gửi lại thành công",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class AcceptProposalView(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def post(self, request, proposal_id):
        proposal = get_object_or_404(Proposal, proposal_id=proposal_id)
        negotiation = proposal.negotiation
        post = negotiation.post

        # Kiểm tra xem người dùng có phải là người thương lượng không
        if negotiation.user != request.user:
            return Response(
                {"message": "Bạn không có quyền chấp nhận đề nghị này."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Kiểm tra xem người thương lượng có chấp nhận đề nghị không
        is_accepted = request.data.get("is_accepted", False)

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
            negotiation.save()

            if (
                post.highest_negotiation_price is None
                or negotiation.negotiation_price > post.highest_negotiation_price
            ):
                post.highest_negotiation_price = negotiation.negotiation_price
                post.highest_negotiation_user = negotiation.user
                post.save()

            serializer = NegotiationSerializer(negotiation)

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
            # negotiation.negotiation_price = request.data.get("negotiation_price")
            # negotiation.negotiation_date = request.data.get("negotiation_date")
            # negotiation.payment_method = request.data.get("payment_method")
            # negotiation.note = request.data.get("note")
            negotiation.save()

            # Tạo chatroom riêng tư nếu chưa tồn tại
            if (
                not ChatRoom.objects.filter(
                    is_private=True, participants=negotiation.user
                )
                .filter(participants=post.user_id)
                .exists()
            ):
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
                {"message": "Bạn không có quyền chấp nhận thương lượng này."},
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

            Negotiation.objects.filter(post=post, is_accepted=False).update(
                is_accepted=False
            )

            serializer = NegotiationSerializer(negotiation)

            return Response(
                {
                    "message": "Thương lượng đã được chấp nhận và bài đăng chuyển sang trạng thái đã cọc",
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
