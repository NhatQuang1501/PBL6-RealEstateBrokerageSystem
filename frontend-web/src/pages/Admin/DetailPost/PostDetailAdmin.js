import ImageCard from "../../../components/image_card/ImageCard";
import DetailDescription from "../../../components/detail_description/DetailDescription";
import BasicInformation from "../../../components/basic_information/BasicInformation";
import ProfileInformation from "../../../components/profile_information/ProfileInformation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa";
import { useAppContext } from "../../../AppProvider";
import { useParams } from "react-router-dom";
import Comment from "../../../components/comment/Comment";
import NegotiationList from "../../../components/neogotiation/NegotiationList";
import MapView from "../../../components/map_api/Mapbox";


const PostDetailAdmin = () => {
  const { sessionToken } = useAppContext();
  const { postId } = useParams();
  const [post, setPost] = useState();

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
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPostById();

    // fetch images
  }, [postId, sessionToken]);

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
                district={post.district}
                city={post.city}
                description={post.description}
                longitude={post.longitude}
                latitude={post.latitude}
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
          <Comment id={postId} sessionToken={sessionToken} />

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
