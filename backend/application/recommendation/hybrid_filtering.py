from .collaborative_filtering import collaborative_filtering
from .content_based_filtering import content_based_filtering


def hybrid_filtering(user_id, num_recommendations=5):
    # Lấy đề xuất từ Collaborative Filtering
    collaborative_recommendations = collaborative_filtering(
        user_id, num_recommendations
    )

    # Lấy đề xuất từ Content-based Filtering
    content_based_recommendations = content_based_filtering(
        user_id, num_recommendations
    )

    # Kết hợp hai danh sách đề xuất
    combined_recommendations = list(
        set(collaborative_recommendations + content_based_recommendations)
    )

    # Trả về danh sách các bài đăng được đề xuất
    return combined_recommendations[:num_recommendations]
