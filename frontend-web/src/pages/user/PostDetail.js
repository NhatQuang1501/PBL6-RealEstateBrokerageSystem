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
  faEdit,
  faTrash,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useCallback } from "react";
import { FaPen } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Comment from "../../components/comment/Comment";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NegotiationList from "../../components/neogotiation/NegotiationList";
import MapView from "../../components/map_api/Mapbox";

const DetailPost = () => {
  const { id, sessionToken } = useAppContext();
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [isClicked, setIsClicked] = useState();
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const [reactionsCount, setReactionsCount] = useState();
  const [commentCount, setCommentCount] = useState();
  const [savesCount, setSavesCount] = useState();

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
        setSavesCount(data.save_count);
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
        await axios.post(
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
    <div className="flex flex-col items-center bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] font-montserrat">
      <button
        className="bg-[#3CA9F9] text-white px-5 py-3 rounded-full mt-5 ml-8 self-start flex items-center"
        onClick={() => window.history.back()}
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Quay lại
      </button>

      <div className="flex items-center justify-between w-[95%] mt-6 mb-4 mr-3 px-6 py-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl shadow-lg">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <FontAwesomeIcon
            icon={faListAlt}
            className="text-blue-600 bg-white p-3 w-8 h-8 rounded-full shadow-md"
          />
          Chi tiết bài đăng
        </h3>
        
        {post && post.user.user_id === id && post.sale_status === "Đang bán" && (
          <button
            className="bg-[#3CA9F9] text-white px-5 py-3 rounded-full mt-5 ml-5 self-start flex items-center mb-5"
            onClick={handleUploadImage}
          >
            <FontAwesomeIcon icon={faUpload} className="mr-2" />
            Tải ảnh lên
          </button>
        )}
      </div>

      <div className="flex flex-row-2 gap-3 items-start justify-center">
        {/* Main content */}
        <div className="p-6 mt-5 mb-5 ml-10 w-[57rem] rounded-lg bg-white border-double border-gray-300 border-[2px] shadow-md">
          {post ? (
            <>
              <div className="flex justify-between items-center px-2 py-4">
                <h1 className="text-xl font-semibold text-black rounded-lg flex items-center">
                  <FaPen className="mr-2" />
                  {post.title}
                </h1>
                <div
                  className={`px-5 max-w-[15rem] text-center py-2 text-white font-bold rounded-[0.5rem] ${getStatusClass(
                    post.sale_status
                  )}`}
                >
                  {post.sale_status}
                </div>
              </div>

              {id !== post.user.user_id && (
                <div className="mt-5 flex justify-center items-center">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-blue-600 hover:to-blue-500">
                    <FontAwesomeIcon icon={faHandshake} className="text-lg" />
                    Thương lượng
                  </button>
                </div>
              )}

              <div className="mt-4 flex justify-center items-center gap-10">
                {id === post.user.user_id &&
                  post.sale_status === "Đang bán" && (
                    <>
                      <button
                        className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold w-[8rem] px-2 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        onClick={() => {
                          handleUpdate(post.post_id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-lg" />
                        Cập nhật
                      </button>
                    </>
                  )}

                {id === post.user.user_id && (
                  <>
                    <button
                      className="bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold w-[8rem] px-2 py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
                      onClick={() => {
                        handleDelete(post.post_id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-lg" />
                      Xóa
                    </button>
                  </>
                )}
              </div>

              {/* Profile + reaction */}
              <div className="flex flex-row justify-between border-b-[2px] border-gray-300 border-solid pb-5">
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
                    <span>{savesCount}</span>
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
                longitude={post.longitude}
                latitude={post.latitude}
              />
              {/* Image */}
              {id === post.user.user_id && (
                <ImageCard type="detail" postId={postId} auth="owner" />
              )}
              {id !== post.user.user_id && (
                <ImageCard type="detail" postId={postId} auth="user" />
              )}
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
        <div className="flex flex-col">
          {/* Comment */}
          <Comment id={postId} sessionToken={sessionToken} />

          {/* Neogotiation */}
          {post && post.user.user_id === id ? (
            <>
              <NegotiationList type="owner" />
              <MapView longitude={post?.longitude} latitude={post?.latitude} />
            </>
          ) : (
            <>
              <NegotiationList />
              <MapView longitude={post?.longitude} latitude={post?.latitude} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPost;
