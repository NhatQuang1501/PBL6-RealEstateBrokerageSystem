from .collaborative_filtering import collaborative_filtering
from .content_based_filtering import content_based_filtering


def hybrid_filtering(user_id, num_recommendations=5):
    collaborative_recommendations = collaborative_filtering(
        user_id, num_recommendations
    )
    content_based_recommendations = content_based_filtering(
        user_id, num_recommendations
    )
    combined_recommendations = list(
        set(collaborative_recommendations + content_based_recommendations)
    )

    return combined_recommendations[:num_recommendations]
