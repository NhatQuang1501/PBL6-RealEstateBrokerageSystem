import ImageCard from "../../components/image_card/ImageCard";
import DetailDescription from "../../components/detail_description/DetailDescription";
import BasicInformation from "../../components/basic_information/BasicInformation";
import ProfileInformation from "../../components/profile_information/ProfileInformation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShareAlt,
  faBookmark,
  faListAlt,
  faArrowLeft,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Comment from "../../components/comment/Comment";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DetailPost = () => {
  const { id, sessionToken } = useAppContext();
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [isClicked, setIsClicked] = useState();
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const [reactionsCount, setReactionsCount] = useState();
  const [commentCount, setCommentCount] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSaveClick = () => {
    setTimeout(() => {
      setIsSaved(!isSaved);
    }, 80);
  };

  const handleUpdate = (postId) => {
    navigate(`/user/update-post/${postId}`);
  };

  // Delete post
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
        console.log("Post deleted successfully");
        navigate("/user/personal-page");
      } else {
        console.error("Failed to delete the post");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Get post
  useEffect(() => {
    console.log("Post ID:", postId);
    const fetchPostById = async () => {
      try {
        let url = `http://127.0.0.1:8000/api/posts/${postId}/`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const data = await response.json();
        console.log("Post data:", data);
        setReactionsCount(data.reactions_count);
        setCommentCount(data.comments_count);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPostById();

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
          if (likedPosts.includes(postId)) {
            setIsClicked(true);
          }
        }
      } catch (error) {
        console.error("Error checking liked posts:", error);
      }
    };
    checkLiked();

    // fetch images
  }, [postId, sessionToken]);

  // check liked
  // useEffect(() => {}, [sessionToken, postId]);

  const handleClick = useCallback(async () => {
    // setIsClicked((prevClicked) => {
    //   setReactionsCount((prevCount) =>
    //     prevClicked ? prevCount - 1 : prevCount + 1
    //   );
    //   return !prevClicked;
    // });
    if (!sessionToken) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    } else {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/posts/${postId}/like/`,
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
      window.location.reload();
    }
  }, [sessionToken, postId]);

  //test upload image
  const handleUploadImage = () => {
    navigate(`/upload-image/${postId}`);
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-400 font-montserrat">
      <button
        className="bg-[#3CA9F9] text-white px-5 py-3 rounded-full mt-5 ml-5 self-start flex items-center"
        onClick={() => window.history.back()}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Quay lại
      </button>

      <button
        className="bg-[#3CA9F9] text-white px-5 py-3 rounded-full mt-5 ml-5 self-start flex items-center"
        onClick={handleUploadImage}
      >
        <FontAwesomeIcon icon={faUpload} className="mr-2" />
        Tải ảnh lên
      </button>

      <h3 className="mt-5 p-2 text-2xl font-bold text-white flex items-center gap-2 pl-5 w-[22rem] shadow-2xl shadow-[#E4FFFC] rounded-[3rem]">
        <FontAwesomeIcon
          icon={faListAlt}
          className="text-white bg-[#3CA9F9] p-3 w-5 h-5 rounded-full"
        />
        Chi tiết bài đăng
      </h3>

      <div className="flex flex-row-2 items-start justify-start">
        {/* Main content */}
        <div className="p-6 mt-5 mb-5 max-w-[65%] mx-auto rounded-lg bg-white border-double border-[#3CA9F9] border-[2px] shadow-md">
          {post ? (
            <>
              <div className="flex justify-between items-center px-6 py-4 bg-white">
                <h1 className="text-2xl font-bold text-[#3CA9F9] mb-4">
                  {post.title}
                </h1>
                <div className="px-5 w-[10rem] justify-center text-center py-2 text-[#3CA9F9] border-[2px] border-double border-[#3CA9F9] rounded-[0.5rem]">
                  {post.sale_status}
                </div>
              </div>

              {id !== post.user.user_id && (
                <div className="mt-4 flex justify-end items-end">
                  <button className="bg-[#3CA9F9] text-white px-5 py-3 rounded-md">
                    Thương lượng
                  </button>
                </div>
              )}

              {id === post.user.user_id && (
                <div className="mt-4 flex justify-end items-center gap-4">
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

              {/* Profile + reaction */}
              <div className="flex flex-row justify-between">
                <div className="">
                  <ProfileInformation
                    name={post.user.username}
                    user_id={post.user.user_id}
                    date={post.created_at}
                  />
                </div>

                <div className="flex space-x-8 mt-4 justify-end">
                  {/* Heart */}
                  <div className="flex items-end text-gray-500 space-x-1">
                    <button
                      onClick={handleClick}
                      className="focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className={`w-8 h-8 transition duration-100 ${
                          isClicked ? "text-red-400" : "text-gray-500"
                        }`}
                      />
                    </button>
                    <span>{reactionsCount}</span>
                  </div>
                  {/* Chat */}
                  <div className="flex items-end text-[#3CA9F9] space-x-1">
                    <FontAwesomeIcon icon={faComment} className="w-8 h-8" />
                    <span>{commentCount}</span>
                  </div>
                  {/* Share */}
                  <div className="flex items-end text-gray-500 space-x-1">
                    <FontAwesomeIcon icon={faShareAlt} className="w-8 h-8" />
                    <span>124</span>
                  </div>
                  {/* Save */}
                  <div className="flex items-end text-gray-500 space-x-1">
                    <button
                      onClick={handleSaveClick}
                      className="focus:outline-none"
                    >
                      <FontAwesomeIcon
                        icon={faBookmark}
                        className={`w-8 h-8 transition duration-100 ${
                          isSaved ? "text-yellow-400" : "text-gray-500"
                        }`}
                      />
                    </button>
                    <span>2</span>
                  </div>
                </div>
              </div>

              <BasicInformation
                price={post.price}
                area={post.area}
                orientation={post.orientation}
                bedroom={post.bedroom}
                bathroom={post.bathroom}
                floor={post.floor}
                legal_status={post.legal_status}
                frontage={post.frontage}
                address={post.address}
                district={post.district}
                city={post.city}
                description={post.description}
              />
              {/* Image */}
              {/* http://127.0.0.1:8000/api/posts/cc129313-2e8c-44a5-84d8-f55a85529f49/images/ */}
              <ImageCard
                type="detail"
                postId={postId}
                // images={images}
              />
              <DetailDescription
                description={post.description}
                maxLength={5000000}
              />
            </>
          ) : (
            <div className="text-center text-gray-500">
              Đang tải bài đăng...
            </div>
          )}
        </div>

        {/* Comment */}
        <Comment id={postId} sessionToken={sessionToken} />
      </div>
    </div>
  );
};

export default DetailPost;
