import ImageCard from "../../../components/image_card/ImageCard";
import DetailDescription from "../../../components/detail_description/DetailDescription";
import BasicInformation from "../../../components/basic_information/BasicInformation";
import ProfileInformation from "../../../components/profile_information/ProfileInformation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faListAlt, faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { useAppContext } from "../../../AppProvider";
import { useParams, useLocation } from "react-router-dom";
import Comment from "../../../components/comment/Comment";
import NegotiationList from "../../../components/neogotiation/NegotiationList";
import MapView from "../../../components/map_api/Mapbox";
import axios from "axios";

const PostDetailAdmin = () => {
  const { sessionToken, role } = useAppContext();
  const { postId } = useParams();
  const [post, setPost] = useState();
  const [postStatus, setPostStatus] = useState();
  const [selectedPostIdD, setSelectedPostIdD] = useState(null);
  const [showPopupD, setShowPopupD] = useState(false);
  const [showPopUpConfirm, setShowPopUpConfirm] = useState(false);
  const [showPopUpDelete, setShowPopUpDelete] = useState(false);

  //Cmt_id location
  const location = useLocation();
  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  const queryParams = getQueryParams(location.search);
  const commentId = queryParams.get("comment_id");
  console.log("Comment ID=>>>>>>:", commentId);

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

  useEffect(() => {
    console.log("Post ID:", postId);
    const fetchPostById = async () => {
      try {
        let url = `http://127.0.0.1:8000/api/admin/posts/${postId}/`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }

        const data = await response.json();
        console.log("Post data:", data);
        setPost(data);
        setPostStatus(data.status);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPostById();

    // fetch images
  }, [postId, sessionToken]);

  // Admin
  const handleApprovePost = async (postId) => {
    setShowPopupD(false);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/admin/posts/`,
        {
          post_id: postId,
          status: "đã duyệt",
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Duyệt bài đăng thành công");
        window.location.reload();
      } else {
        alert("Duyệt bài đăng thất bại");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  const handleRefusePost = async (postId) => {
    setShowPopUpConfirm(false);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/admin/posts/`,
        {
          post_id: postId,
          status: "bị từ chối",
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Từ chối duyệt bài đăng thành công");
        window.location.reload();
      } else {
        alert("Từ chối duyệt bài đăng thất bại");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    setShowPopUpConfirm(false);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/admin/posts/${postId}/`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Xóa bài đăng thành công");
        window.location.reload();
      } else {
        alert("Xóa bài đăng thất bại");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  return (
    <div className="flex flex-col items-center font-montserrat">
      <div className="flex items-center justify-between w-[95%] mt-6 mb-4 mr-3 px-6 py-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-3xl shadow-lg">
        <h3 className="text-2xl font-bold text-gray-600 flex items-center gap-3">
          <FontAwesomeIcon
            icon={faListAlt}
            className="text-gray-600 bg-white p-3 w-8 h-8 rounded-full shadow-md"
          />
          Chi tiết bài đăng
        </h3>
        {role === "admin" && postStatus === "Đang chờ duyệt" && (
          <div className="flex justify-center items-center gap-10">
            <button
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-yellow-600 hover:to-yellow-500"
              onClick={() => {
                setShowPopupD(true);
                setSelectedPostIdD(post.post_id);
              }}
            >
              <FontAwesomeIcon icon={faCheck} className="text-lg" />
              Duyệt bài đăng
            </button>

            <button
              className="bg-gradient-to-r from-red-500 to-red-400 text-white font-bold px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-red-600 hover:to-red-500"
              onClick={() => {
                setShowPopUpConfirm(true);
                setSelectedPostIdD(post.post_id);
              }}
            >
              <FontAwesomeIcon icon={faX} className="text-lg" />
              Từ chối duyệt
            </button>
          </div>
        )}

        {role === "admin" && postStatus === "Đã duyệt" && (
          <div className="flex justify-center items-center gap-10">
            <button
              className="bg-gradient-to-r from-red-500 to-red-400 text-white font-bold px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transform hover:scale-105 transition-transform duration-200 ease-in-out hover:from-red-600 hover:to-red-500"
              onClick={() => {
                setShowPopUpDelete(true);
                setSelectedPostIdD(post.post_id);
              }}
            >
              <FontAwesomeIcon icon={faX} className="text-lg" />
              Xóa bài đăng
            </button>
          </div>
        )}

        {showPopupD && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
            style={{ zIndex: 9999 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mx-4">
              <div className="font-montserrat">
                <div className="text-center">
                  <p className="font-extrabold text-[1.3rem] text-gray-800">
                    Xác nhận
                  </p>
                </div>
                <hr className="my-4 border-gray-300" />
                <p className="text-gray-600 text-[0.95rem] text-center font-bold leading-snug">
                  Bạn chắc chắn muốn thực hiện hành động này? Hãy kiểm tra kỹ
                  trước khi xác nhận.
                </p>
                <div className="flex justify-center mt-6 gap-4">
                  <button
                    className="flex items-center bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => setShowPopupD(false)}
                  >
                    <FontAwesomeIcon icon={faX} className="mr-2" />
                    Đóng
                  </button>
                  <button
                    className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => handleApprovePost(selectedPostIdD)}
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPopUpConfirm && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
            style={{ zIndex: 9999 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mx-4">
              <div className="font-montserrat">
                <div className="text-center">
                  <p className="font-extrabold text-[1.3rem] text-gray-800">
                    Xác nhận
                  </p>
                </div>
                <hr className="my-4 border-gray-300" />
                <p className="text-gray-600 text-[0.95rem] text-center font-bold leading-snug">
                  Bạn có chắc chắn từ chối duyệt bài đăng này? Hãy kiểm tra kỹ
                  trước khi xác nhận.
                </p>
                <div className="flex justify-center mt-6 gap-4">
                  <button
                    className="flex items-center bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => setShowPopUpConfirm(false)}
                  >
                    <FontAwesomeIcon icon={faX} className="mr-2" />
                    Đóng
                  </button>
                  <button
                    className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => handleRefusePost(selectedPostIdD)}
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showPopUpDelete && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
            style={{ zIndex: 9999 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mx-4">
              <div className="font-montserrat">
                <div className="text-center">
                  <p className="font-extrabold text-[1.3rem] text-gray-800">
                    Xác nhận
                  </p>
                </div>
                <hr className="my-4 border-gray-300" />
                <p className="text-gray-600 text-[0.95rem] text-center font-bold leading-snug">
                  Bạn có chắc chắn từ chối duyệt bài đăng này? Hãy kiểm tra kỹ
                  trước khi xác nhận.
                </p>
                <div className="flex justify-center mt-6 gap-4">
                  <button
                    className="flex items-center bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => setShowPopUpDelete(false)}
                  >
                    <FontAwesomeIcon icon={faX} className="mr-2" />
                    Đóng
                  </button>
                  <button
                    className="flex items-center bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => handleDeletePost(selectedPostIdD)}
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
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

              {/* Profile + reaction */}
              <div className="flex flex-row justify-between border-b-[2px] border-gray-300 border-solid pb-5">
                <div className="">
                  <ProfileInformation
                    name={post.user.username}
                    user_id={post.user.user_id}
                    date={post.created_at}
                  />
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
                ward={post.ward}
                district={post.district}
                city={post.city}
                description={post.description}
                longitude={post.longitude}
                latitude={post.latitude}
                land_lot={post.land_lot} // Lô đất
                land_parcel={post.land_parcel} // Thửa đất
                map_sheet_number={post.map_sheet_number} // Tờ bản đồ
              />
              {/* Image */}
              <ImageCard type="detail" postId={postId} />
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
          <Comment
            post_id={postId}
            sessionToken={sessionToken}
            reportedCmtId={commentId}
          />

          {/* Neogotiation */}
          {post && (
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

export default PostDetailAdmin;
