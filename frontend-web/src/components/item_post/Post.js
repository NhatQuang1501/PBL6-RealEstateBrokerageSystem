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
  faRoad,
  faHandshake,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FaPen, FaRegFileAlt } from "react-icons/fa";

import ProfileInformation from "../profile_information/ProfileInformation";
import { useAppContext } from "../../AppProvider";
// import DetailDescription from "../detail_description/DetailDescription";
import axios from "axios";
import ImageCard from "../image_card/ImageCard";
import DetailDescription from "../detail_description/DetailDescription";

function Post({ post, type }) {
  const { id, sessionToken, posts, setPost } = useAppContext();
  const navigate = useNavigate();
  const [reactionsCount, setReactionsCount] = useState(post.reactions_count);
  const [savesCount, setSavesCount] = useState(post.save_count);
  const [isClicked, setIsClicked] = useState();
  const [isSaved, setIsSaved] = useState();

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang bán":
        return "bg-gradient-to-r from-blue-400 to-blue-600";
      case "Đã bán":
        return "bg-gradient-to-r from-gray-400 to-gray-600";
      case "Đang thương lượng":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      default:
        return "bg-gradient-to-r from-red-400 to-red-600";
    }
  };

  useEffect(() => {
    // Check like
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

    // Check save
    const checkSaved = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/saved-posts/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const savedPosts = response.data.map((post) => post.post_id);
          if (savedPosts.includes(post.post_id)) {
            setIsSaved(true);
          }
        }
      } catch (error) {
        console.error("Error checking saved posts:", error);
      }
    };

    checkSaved();
    checkLiked();
  }, [post.post_id, sessionToken, id]);

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

  const handleSaveClick = useCallback(async () => {
    if (!sessionToken) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    } else {
      setIsSaved((prevSaved) => {
        setSavesCount((prevCount) =>
          prevSaved ? prevCount - 1 : prevCount + 1
        );
        return !prevSaved;
      });
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/saved-posts/${post.post_id}/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error saving the post:", error);
      }
    }
  }, [sessionToken, post.post_id]);


  const formatPrice = (price) => {
    if (price >= 1_000_000_000) {
      const billionValue = price / 1_000_000_000;
      return Number.isInteger(billionValue)
        ? `${billionValue} tỷ VND`
        : `${billionValue.toFixed(3)} tỷ VNĐ`;
    } else if (price >= 1_000_000) {
      const millionValue = price / 1_000_000;
      return Number.isInteger(millionValue)
        ? `${millionValue} triệu VNĐ`
        : `${millionValue.toFixed(3)} triệu VNĐ`;
    } else {
      return `${price} VNĐ`;
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
    <div className="w-full mx-auto p-[1rem] bg-white rounded-lg shadow-md border-[1px] border-gray-300 border-double overflow-hidden font-montserrat ">
      {/* Header */}
      <div
        className="flex justify-between items-center px-2 cursor-pointer"
        onClick={handleDetailClick}
      >
        <h2 className="text-xl font-semibold text-black rounded-lg flex items-center">
          <FaPen className="mr-2" />
          {post.title}
        </h2>

        <div
          className={`px-5 max-w-[15rem] text-center py-2 text-white font-bold rounded-[0.5rem] ${getStatusClass(
            post.sale_status
          )}`}
        >
          {post.sale_status}
        </div>
      </div>

      {/* main_container */}
      <div className="flex flex-col justify-center py-2">
        {/* Left (45%) */}
        <div className="w-full">
          {/* Img */}
          <ImageCard postId={post.post_id} />
        </div>

        {/* Right column (55%) */}
        <div className="flex flex-col gap-2 justify-center w-full">
          {post.estate_type === "Nhà" && (
            <div className="flex flex-col gap-4 p-4 text-gray-700 text-lg font-semibold bg-white rounded-lg shadow-md">
              <div className="flex flex-row gap-7">
                <div className="flex flex-row items-center justify-start bg-gradient-to-br from-red-400 to-pink-500 text-white rounded-lg p-4 shadow-md mb-3 border-2 border-white max-w-sm transform hover:scale-105 transition-transform duration-200 ease-out">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faDollarSign} className="text-lg" />
                    <p className="text-lg font-medium">Giá bán:</p>
                  </div>
                  <p className="text-2xl font-bold mt-1 ml-4">
                    {formatPrice(post.price)}
                  </p>
                </div>

                <DetailDescription
                  description={post.description}
                  maxLength={30}
                  moreLink={`/user/detail-post/${post.post_id}`}
                  onClick={handleDetailClick}
                />
              </div>

              {/* Thông tin chung */}
              <div className="grid grid-cols-3 gap-4 border-t-[2px] border-gray-200 border-solid pt-4">
                <div className="bg-blue-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-red-600 font-medium text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    Địa chỉ:
                  </p>
                  <p className="text-center mt-1">
                    {post.address}, Quận {post.district}, Thành phố {post.city}
                  </p>
                </div>

                <div className="bg-blue-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-blue-600 font-medium text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faRulerCombined} className="mr-2" />
                    Diện tích:
                  </p>
                  <p className="text-center mt-1">{post.area}m²</p>
                </div>

                <div className="bg-blue-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-blue-400 font-medium text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faBed} className="mr-2" />
                    Số phòng ngủ:
                  </p>
                  <p className="text-center mt-1">{post.bedroom} phòng ngủ</p>
                </div>

                <div className="bg-blue-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-yellow-600 font-medium text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faBath} className="mr-2" />
                    Số phòng tắm:
                  </p>
                  <p className="text-center mt-1">{post.bathroom} phòng tắm</p>
                </div>

                <div className="bg-blue-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-gray-600 font-medium text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faCompass} className="mr-2" />
                    Hướng nhà:
                  </p>
                  <p className="text-center mt-1">{post.orientation}</p>
                </div>

                <div
                  className="bg-blue-100 rounded-lg p-3 flex justify-center items-center shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={handleDetailClick}
                >
                  <p className="text-black font-bold text-center italic">
                    Xem thêm ...
                  </p>
                </div>
              </div>
            </div>
          )}
          {post.estate_type === "Đất" && (
            <div className="flex flex-col gap-4 p-4 text-gray-700 text-lg font-semibold bg-white rounded-lg shadow-md">
              {/* Giá + Detail */}
              <div className="flex flex-row gap-7">
                <div className="flex flex-row items-center justify-start bg-gradient-to-br from-red-400 to-pink-500 text-white rounded-lg p-4 shadow-md mb-3 border-2 border-white max-w-sm transform hover:scale-105 transition-transform duration-200 ease-out">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faDollarSign} className="text-lg" />
                    <p className="text-lg font-medium">Giá bán:</p>
                  </div>
                  <p className="text-2xl font-bold mt-1 ml-4">
                    {formatPrice(post.price)}
                  </p>
                </div>

                <DetailDescription
                  description={post.description}
                  maxLength={30}
                  moreLink={`/user/detail-post/${post.post_id}`}
                  onClick={handleDetailClick}
                />
              </div>

              {/* Thông tin chung */}
              <div className="grid grid-cols-3 gap-4 border-t-[2px] border-gray-200 border-solid pt-4">
                <div className="bg-blue-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-red-600 font-medium text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    Địa chỉ:
                  </p>
                  <p className="text-center mt-1">
                    {post.address}, Quận {post.district}, Thành phố {post.city}
                  </p>
                </div>

                <div className="bg-blue-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-blue-600 font-medium text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faRulerCombined} className="mr-2" />
                    Diện tích:
                  </p>
                  <p className="text-center mt-1">{post.area}m²</p>
                </div>

                <div className="bg-blue-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-blue-400 font-medium text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faRoad} className="mr-2" />
                    Mặt tiền (m):
                  </p>
                  <p className="text-center mt-1">{post.frontage} m</p>
                </div>

                <div className="bg-blue-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-gray-600 font-medium text-center flex items-center justify-center">
                    <FontAwesomeIcon icon={faCompass} className="mr-2" />
                    Hướng đất:
                  </p>
                  <p className="text-center mt-1">{post.orientation}</p>
                </div>

                <div className="bg-blue-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-yellow-600 font-medium text-center flex items-center justify-center">
                    <FaRegFileAlt className="mr-2" />
                    Tình trạng pháp lý:
                  </p>
                  <p className="text-center mt-1">{post.legal_status}</p>
                </div>

                <div
                  className="bg-blue-100 rounded-lg p-3 flex justify-center items-center shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  onClick={handleDetailClick}
                >
                  <p className="text-black font-bold text-center italic">
                    Xem thêm ...
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center ">
            <div className="flex space-x-8 mt-5 justify-between w-[70%] border-t-[3px] border-[#b2ebf2] border-solid pt-5 pl-5 pr-5 rounded-t-xl">
              {/* Heart */}
              <div className="flex flex-col items-center text-gray-500 gap-2">
                <button
                  onClick={handleClick}
                  className="focus:outline-none"
                  title="Yêu thích"
                >
                  <div className="flex gap-2 items-center space-x-1">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`w-6 h-6 transition duration-100 ${
                        isClicked ? "text-red-400" : "text-gray-500"
                      }`}
                    />
                    <span>{reactionsCount}</span>
                  </div>
                </button>
                <span className="text-xs">Yêu thích</span>
              </div>
              {/* Chat */}
              <div
                className="flex flex-col items-center text-gray-500 gap-2 cursor-pointer"
                onClick={handleDetailClick}
                title="Bình luận"
              >
                <div className="flex gap-2 items-center space-x-1">
                  <FontAwesomeIcon icon={faComment} className="w-6 h-6" />
                  <span>{post.comments_count}</span>
                </div>
                <span className="text-xs">Bình luận</span>
              </div>
              {/* Share */}
              <div
                className="flex flex-col items-center text-gray-500 gap-2"
                title="Chia sẻ"
              >
                <div className="flex gap-2 items-center space-x-1">
                  <FontAwesomeIcon icon={faShareAlt} className="w-6 h-6" />
                  <span>124</span>
                </div>
                <span className="text-xs">Chia sẻ</span>
              </div>
              {/* Save */}
              {type !== "personal-page" && (
                <div
                  className="flex flex-col items-center text-gray-500 gap-2"
                  title="Lưu bài"
                >
                  <button
                    onClick={handleSaveClick}
                    className="focus:outline-none"
                  >
                    <div className="flex gap-2 items-center space-x-1">
                      <FontAwesomeIcon
                        icon={faBookmark}
                        className={`w-6 h-6 transition duration-100 ${
                          isSaved ? "text-yellow-400" : "text-gray-500"
                        }`}
                      />
                      <span>{savesCount}</span>
                    </div>
                  </button>
                  <span className="text-xs">Lưu bài</span>
                </div>
              )}
            </div>
          </div>

          {/* Neo_btn */}
          {id !== post.user.user_id && (
            <div className="mt-5 flex justify-center items-center">
              <button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-blue-600 hover:to-blue-500">
                <FontAwesomeIcon icon={faHandshake} className="text-lg" />
                Thương lượng
              </button>
            </div>
          )}
          {id === post.user.user_id && (
            <div className="mt-4 flex justify-center items-center gap-10">
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold w-[8rem] px-2 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={() => {
                  handleUpdate(post.post_id);
                }}
              >
                <FontAwesomeIcon icon={faEdit} className="text-lg" />
                Cập nhật
              </button>

              <button
                className="bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold w-[8rem] px-2 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={() => {
                  handleDelete(post.post_id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} className="text-lg" />
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
            {Math.floor(post.view_count / 2)} lượt xem
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
    save_count: PropTypes.number.isRequired,
  }).isRequired,
};

Post.defaultProps = {
  post: null,
};
export default Post;
