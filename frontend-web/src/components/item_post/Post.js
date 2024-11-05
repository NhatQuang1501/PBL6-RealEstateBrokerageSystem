import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShareAlt,
  faBookmark,
  faDollarSign,
  faMapMarkerAlt,
  faBed,
  faRulerCombined,
  faCompass,
  faBath,
} from "@fortawesome/free-solid-svg-icons";

import ProfileInformation from "../profile_information/ProfileInformation";
import { useAppContext } from "../../AppProvider";
// import DetailDescription from "../detail_description/DetailDescription";
import axios from "axios";
import ImageCard from "../image_card/ImageCard";

function Post({ post, type }) {
  const { id, sessionToken, posts, setPost } = useAppContext();
  const navigate = useNavigate();
  const [reactionsCount, setReactionsCount] = useState(post.reactions_count);
  const [isClicked, setIsClicked] = useState();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkLiked = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/user-posts-like/`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const likedPosts = response.data.map((post) => post.post_id);
          if (likedPosts.includes(post.post_id)) {
            setIsClicked(true);
          }
        }
      } catch (error) {
        console.error("Error checking liked posts:", error);
      }
    };
    checkLiked();

  }, [post.post_id, sessionToken]);

  const handleClick = useCallback(async () => {
    if (!sessionToken) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    } else {
      setIsClicked((prevClicked) => {
        setReactionsCount((prevCount) =>
          prevClicked ? prevCount - 1 : prevCount + 1
        );
        return !prevClicked;
      });
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/posts/${post.post_id}/like/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error liking the post:", error);
      }
    }
  }, [sessionToken, post.post_id]);

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
  };

  const formatPrice = (price) => {
    if (price >= 1_000_000_000) {
      const billionValue = price / 1_000_000_000;
      return Number.isInteger(billionValue)
        ? `${billionValue} tỷ VND`
        : `${billionValue.toFixed(3)} tỷ VND`;
    } else if (price >= 1_000_000) {
      const millionValue = price / 1_000_000;
      return Number.isInteger(millionValue)
        ? `${millionValue} triệu VND`
        : `${millionValue.toFixed(3)} triệu VND`;
    } else {
      return `${price} VND`;
    }
  };
  const handleDetailClick = () => {
    navigate(`/user/detail-post/${post.post_id}`);
  };

  const handleDelete = async (postId) => {
    const userConfirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa bài đăng này không?"
    );
    if (!userConfirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/posts/${postId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setPost(posts.filter((post) => post.id !== postId));
      } else {
        console.error("Failed to delete the post");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/user/update-post/${postId}`);
  };

  return (
    <div className="w-full mx-auto p-[1rem] bg-white rounded-lg shadow-md border-2 border-[#3CA9F9] border-double overflow-hidden font-montserrat">
      {/* Header */}
      <div
        className="flex justify-between items-center px-6  bg-white cursor-pointer"
        onClick={handleDetailClick}
      >
        <h2 className="text-xl font-semibold text-[#3CA9F9]">{post.title}</h2>
        <div className="px-5 w-[10rem] justify-center text-center py-2 text-[#3CA9F9] border-[2px] border-double border-[#3CA9F9] rounded-[0.5rem]">
          {post.sale_status}
        </div>
      </div>

      {/* main_container */}
      <div className="flex flex-row px-2 py-2">
        {/* Left (45%) */}
        <div className="w-[45%] pr-4">
          {/* Img */}
          <ImageCard postId={post.post_id} />
        </div>

        {/* Right column (55%) */}
        <div className="flex flex-col gap-2 justify-between w-[55%] pl-4">
          {post.estate_type === "Nhà" && (
            <div className="grid grid-cols-2 gap-4 p-2 text-gray-700 text-lg border-[1px] border-double border-[#3CA9F9] rounded-lg font-bold">
              <div className="">
                <p className="text-red-600 mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                  <span className="font-normal">Giá bán: </span>
                  {formatPrice(post.price)}
                </p>
                <p className="mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  <span className="font-normal">Địa chỉ: </span>
                  {post.address}, Quận {post.district}, Thành phố {post.city}
                </p>
                <p className="mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faBed} className="mr-2" />
                  <span className="font-normal">Số phòng ngủ: </span>
                  {post.bedroom} phòng ngủ
                </p>
              </div>
              <div>
                <p className="text-red-600 mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faRulerCombined} className="mr-2" />
                  <span className="font-normal">Diện tích: </span>
                  {post.area}m²
                </p>
                <p className="mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faCompass} className="mr-2" />
                  <span className="font-normal">Hướng nhà: </span>
                  {post.orientation}
                </p>
                <p className="mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faBath} className="mr-2" />
                  <span className="font-normal">Số phòng tắm: </span>
                  {post.bathroom} phòng tắm
                </p>
              </div>
            </div>
          )}
          {post.estate_type === "Đất" && (
            <div className="grid grid-cols-2 gap-4 p-2 text-gray-700 text-lg border-[1px] border-double border-[#3CA9F9] rounded-lg font-bold">
              <div className="">
                <p className="text-red-600 mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                  <span className="font-normal">Giá bán: </span>
                  {formatPrice(post.price)}
                </p>
                <p className="mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                  <span className="font-normal">Địa chỉ: </span>
                  {post.address}, Quận {post.district}, Thành phố {post.city}
                </p>
                <p className="mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faBed} className="mr-2" />
                  <span className="font-normal">Mặt tiền (m): </span>
                  {post.frontage}
                </p>
              </div>
              <div>
                <p className="text-red-600 mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faRulerCombined} className="mr-2" />
                  <span className="font-normal">Diện tích: </span>
                  {post.area}m²
                </p>
                <p className="mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faCompass} className="mr-2" />
                  <span className="font-normal">Hướng đất: </span>
                  {post.orientation}
                </p>
                <p className="mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                  <FontAwesomeIcon icon={faBath} className="mr-2" />
                  <span className="font-normal">Tình trạng pháp lý: </span>
                  {post.legal_status}
                </p>
              </div>
            </div>
          )}

          <div className="flex space-x-8 mt-4 justify-between ">
            {/* Heart */}
            <div className="flex items-center text-gray-500 space-x-1 gap-2">
              <button onClick={handleClick} className="focus:outline-none">
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`w-6 h-6 transition duration-100 ${
                    isClicked ? "text-red-400" : "text-gray-500"
                  }`}
                />
              </button>
              <span>{reactionsCount}</span>
            </div>
            {/* Chat */}
            <div
              className="flex items-center text-gray-500 space-x-1 gap-2 cursor-pointer"
              onClick={handleDetailClick}
            >
              <FontAwesomeIcon icon={faComment} className="w-6 h-6" />
              <span>{post.comments_count}</span>
            </div>
            {/* Share */}
            <div className="flex items-center text-gray-500 space-x-1 gap-2">
              <FontAwesomeIcon icon={faShareAlt} className="w-6 h-6" />
              <span>124</span>
            </div>
            {/* Save */}
            {type !== "personal-page" && (
              <div className="flex items-center text-gray-500 space-x-1 gap-2">
                <button
                  onClick={handleSaveClick}
                  className="focus:outline-none"
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className={`w-6 h-6 transition duration-100 ${
                      isSaved ? "text-yellow-400" : "text-gray-500"
                    }`}
                  />
                </button>
                <span>22</span>
              </div>
            )}
          </div>

          {/* Neo_btn */}
          {id !== post.user.user_id && (
            <div className="mt-2 flex justify-center items-center">
              <button className="bg-[#3CA9F9] text-white px-5 py-3 rounded-md">
                Thương lượng
              </button>
            </div>
          )}
          {id === post.user.user_id && (
            <div className="mt-4 flex justify-center items-center gap-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => {
                  handleUpdate(post.post_id);
                }}
              >
                Cập nhật
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={() => {
                  handleDelete(post.post_id);
                }}
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between">
        {/* Profile Info */}
        <ProfileInformation
          type="personal-page"
          name={post.user.username}
          user_id={post.user.user_id}
          date={post.created_at}
        />
        <div className="flex justify-end items-center">
          <div className=" pr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>

          <span className="text-gray-500 w-[8rem]">
            {post.view_count} lượt xem
          </span>
        </div>
      </div>
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    post_id: PropTypes.string.isRequired,
    reactions_count: PropTypes.number.isRequired,
  }).isRequired,
};

Post.defaultProps = {
  post: null,
};
export default Post;
