import numpy as np
from django.db.models import Q
from django.shortcuts import get_object_or_404
from accounts.models import *
from application.models import *


def collaborative_filtering(user_id, num_recommendations=10):
    # Lấy tất cả các bài đăng đã duyệt và không phải của người dùng
    author = get_object_or_404(User.objects.only("user_id"), user_id=user_id)
    all_posts = (
        Post.objects.filter(status=Status.APPROVED)
        .exclude(Q(user_id=author) | Q(sale_status=Sale_status.SOLD))
        .only("post_id")
    )
    all_users = User.objects.filter(role=Role.USER).only("user_id")

    # Tạo ma trận tương tác giữa người dùng và bài đăng
    interaction_matrix = np.zeros((all_users.count(), all_posts.count()))

    for i, user in enumerate(all_users):
        for j, post in enumerate(all_posts):
            if PostReaction.objects.filter(user_id=user, post_id=post).exists():
                interaction_matrix[i, j] = 1

    # Tính toán độ tương đồng giữa người dùng
    user_similarity = np.dot(interaction_matrix, interaction_matrix.T)

    # Lấy chỉ số của người dùng hiện tại
    user_index = list(all_users).index(User.objects.get(user_id=user_id))

    # Tính toán điểm đề xuất cho các bài đăng
    user_ratings = np.dot(user_similarity[user_index], interaction_matrix)

    # Lấy các bài đăng chưa tương tác
    user_interactions = interaction_matrix[user_index]
    recommendations = np.argsort(user_ratings - user_interactions)[::-1]

    recommendations = [int(i) for i in recommendations]

    recommended_posts = [all_posts[i] for i in recommendations[:num_recommendations]]
    return recommended_posts
