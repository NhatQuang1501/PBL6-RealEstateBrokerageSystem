import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from accounts.models import *
from accounts.enums import *
from application.models import *


def content_based_filtering(user_id, num_recommendations=10):
    # Lấy tất cả các bài đăng đã duyệt
    all_posts = Post.objects.filter(status=Status.APPROVED)

    # Tạo ma trận đặc trưng cho các bài đăng
    post_features = []
    for post in all_posts:
        features = f"{post.title} {post.estate_type} {post.city} {post.district} {post.ward} {post.street} {post.address} {post.description}"
        post_features.append(features)

    # Tính toán ma trận TF-IDF
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(post_features)

    # Tính toán độ tương đồng cosine giữa các bài đăng
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # Lấy các bài đăng mà người dùng đã tương tác
    user_interactions = (
        []
    )  # Thay thế bằng danh sách các post_id mà người dùng đã tương tác

    # Chuyển đổi các chỉ số thành số nguyên
    user_interactions_indices = [
        list(all_posts).index(Post.objects.get(post_id=post_id))
        for post_id in user_interactions
    ]

    # Tính toán điểm đề xuất cho các bài đăng
    user_ratings = np.mean(cosine_sim[user_interactions_indices], axis=0)

    # Lấy các bài đăng chưa tương tác
    recommendations = np.argsort(user_ratings)[::-1]

    # Chuyển đổi các chỉ số thành số nguyên
    recommendations = [int(i) for i in recommendations]

    # Trả về danh sách các bài đăng được đề xuất
    recommended_posts = [all_posts[i] for i in recommendations[:num_recommendations]]
    return recommended_posts
