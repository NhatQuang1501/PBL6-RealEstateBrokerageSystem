import React, { useState } from "react";
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
import DetailDescription from "../detail_description/DetailDescription";

function Post({ post }) {
  const navigate = useNavigate();

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setTimeout(() => {
      setIsClicked(!isClicked);
    }, 80);
  };

  const [isSaved, setIsSaved] = useState(false);
  const handleSaveClick = () => {
    setTimeout(() => {
      setIsSaved(!isSaved);
    }, 80);
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
    navigate(`/user/detail-post/${post.id}`);
  };

  return (
    <div className="w-full mx-auto p-[1rem] bg-white rounded-lg shadow-md border-2 border-[#3CA9F9] border-double overflow-hidden font-montserrat">
      {/* Header */}
      <div
        className="flex justify-between items-center px-6 py-4 bg-white cursor-pointer"
        onClick={handleDetailClick}
      >
        <h2 className="text-xl font-semibold text-[#3CA9F9]">{post.title}</h2>
        <div className="px-5 w-[10rem] justify-center text-center py-2 text-[#3CA9F9] border-[2px] border-double border-[#3CA9F9] rounded-[0.5rem]">
          {post.id}
        </div>
      </div>

      {/* main_container */}
      <div className="flex flex-row px-2 py-2">
        {/* Left (45%) */}
        <div className="w-[45%] pr-4">
          {/* Img */}
          <img
            className="w-full h-[80%] object-cover rounded-md"
            src="https://th.bing.com/th/id/OIP.c_e6N6YtIVI2NFhW_Ugm6wHaF7?w=246&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="room_image"
          />

          {/* Profile Info */}
          <ProfileInformation
            name={post.author.username} // Truy cập đúng vào thuộc tính username của tác giả
            date={post.created_at} // Truy cập vào ngày tạo bài viết
          />
        </div>

        {/* Right column (55%) */}
        <div className="flex flex-col gap-2 justify-between w-[55%] pl-4">
          <div className="grid grid-cols-2 gap-4 p-2 text-gray-700 text-lg border-[1px] border-double border-[#3CA9F9] rounded-lg font-bold">
            <div className="">
              <p className="text-red-600 mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                <span className="font-normal">Giá bán: </span>
                {formatPrice(post.price)}
              </p>
              <p className="mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                <span className="font-normal">Địa chỉ: </span> Đường{" "}
                {post.street}, Quận {post.district}, Thành phố {post.city}
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
                <span className="font-normal">Hướng: </span>
                {post.orientation}
              </p>
              <p className="mt-2 border-[1px] border-[#3CA9F9] border-double rounded-xl p-1 text-center shadow-sm shadow-gray-500 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-200 transition-all duration-500 hover:shadow-2xl">
                <FontAwesomeIcon icon={faBath} className="mr-2" />
                <span className="font-normal">Số phòng tắm: </span>
                {post.bathroom} phòng tắm
              </p>
            </div>
          </div>

          {/* Post */}
          <DetailDescription
            className="min-h-[30rem]"
            // description="Bán nhà ở tại 123 Tôn Đức Thắng, Hải Châu, Đà Nẵng. Diện tích 1000m², 5 phòng ngủ, 5 phòng tắm. Hướng Đông Nam. Giá 12 tỷ VND.Bán nhà ở tại 123 Tôn Đức Thắng, Hải Châu, Đà Nẵng. Diện tích 1000m², 5 phòng ngủ, 5 phòng tắm. Hướng Đông Nam. Giá 12 tỷ VNDBán nhà ở tại 123 Tôn Đức Thắng, Hải Châu, Đà Nẵng. Diện tích 1000m², 5 phòng ngủ, 5 phòng tắm. Hướng Đông Nam. Giá 12 tỷ VNDBán nhà ở tại 123 Tôn Đức Thắng, Hải Châu, Đà Nẵng. Diện tích 1000m², 5 phòng ngủ, 5 phòng tắm. Hướng Đông Nam. Giá 12 tỷ VNDBán nhà ở tại 123 Tôn Đức Thắng, Hải Châu, Đà Nẵng. Diện tích 1000m², 5 phòng ngủ, 5 phòng tắm. Hướng Đông Nam. Giá 12 tỷ VNDBán nhà ở tại 123 Tôn Đức Thắng, Hải Châu, Đà Nẵng. Diện tích 1000m², 5 phòng ngủ, 5 phòng tắm. Hướng Đông Nam. Giá 12 tỷ VND"
            description={post.description}
            maxLength={110}
            enableToggle={false}
            moreLink="/user/detail-post"
          />

          <div className="flex space-x-8 mt-4 justify-between">
            {/* Heart */}
            <div className="flex items-end text-gray-500 space-x-1">
              <button onClick={handleClick} className="focus:outline-none">
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`w-8 h-8 transition duration-100 ${
                    isClicked ? "text-red-400" : "text-gray-500"
                  }`}
                />
              </button>
              <span>33</span>
            </div>
            {/* Chat */}
            <div className="flex items-end text-gray-500 space-x-1">
              <FontAwesomeIcon icon={faComment} className="w-8 h-8" />
              <span>124</span>
            </div>
            {/* Share */}
            <div className="flex items-end text-gray-500 space-x-1">
              <FontAwesomeIcon icon={faShareAlt} className="w-8 h-8" />
              <span>124</span>
            </div>
            {/* Save */}
            <div className="flex items-end text-gray-500 space-x-1">
              <button onClick={handleSaveClick} className="focus:outline-none">
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

          {/* Neo_btn */}
          <div className="mt-4 flex justify-center items-center">
            <button className="bg-[#3CA9F9] text-white px-5 py-3 rounded-md">
              Thương lượng
            </button>
          </div>
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

            <span className="text-gray-500 w-[8rem]">1239 lượt xem</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
};

Post.defaultProps = {
  post: null,
};
export default Post;
