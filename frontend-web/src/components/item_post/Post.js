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
// import DetailDescription from "../detail_description/DetailDescription";

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
    navigate(`/user/detail-post/${post.post_id}`);
  };

  return (
    <div className="w-full mx-auto p-[1rem] bg-white rounded-sm shadow-md border-2 border-[#3CA9F9] border-double overflow-hidden font-montserrat">
      {/* Header */}
      <div
        className="flex justify-between items-center bg-white cursor-pointer"
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
          <div className="w-full h-[200px]">
          <img
            className="w-full h-full object-cover "
            src="https://th.bing.com/th/id/OIP.c_e6N6YtIVI2NFhW_Ugm6wHaF7?w=246&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="room_image"
          />
          </div>
          <div className="flex gap-1 mt-1">
          <img
            className="w-1/4 h-[60px] object-cover "
            src="https://th.bing.com/th/id/OIP.c_e6N6YtIVI2NFhW_Ugm6wHaF7?w=246&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="room_image"
          />
           <img
            className="w-1/4 h-[60px] object-cover "
            src="https://th.bing.com/th/id/OIP.c_e6N6YtIVI2NFhW_Ugm6wHaF7?w=246&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="room_image"
          />
           <img
            className="w-1/4 h-[60px] object-cover "
            src="https://th.bing.com/th/id/OIP.c_e6N6YtIVI2NFhW_Ugm6wHaF7?w=246&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="room_image"
          />
           <img
            className="w-1/4 h-[60px] object-cover "
            src="https://th.bing.com/th/id/OIP.c_e6N6YtIVI2NFhW_Ugm6wHaF7?w=246&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="room_image"
          />
          </div>

        </div>

        {/* Right column (55%) */}
        <div className="flex flex-col gap-2 justify-between w-[55%] pl-4">
          {post.estate_type === "Nhà" && (
            <div className="grid p-1 text-gray-800 text-lg border border-[#3CA9F9] font-bold bg-white shadow-sm">
            <div className="flex justify-between items-center mb-4 ">
              <p className="text-emerald-500 text-lg font-semibold">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                Giá: {formatPrice(post.price)}
              </p>
              <p className="text-blue-500 text-lg">
                <FontAwesomeIcon icon={faRulerCombined} className="mr-2" />
                Diện tích: {post.area} m²
              </p>
            </div>
          
            <div className="space-y-2 text-base font-medium ">
              <p className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-600" />
                <span className="font-semibold ">Địa chỉ: {post.address}, Quận {post.district}, Thành phố {post.city}</span>
              </p>
              <p className="flex items-center">
                <FontAwesomeIcon icon={faCompass} className="mr-2 text-yellow-600" />
                <span className="font-semibold mr-1">Hướng nhà: </span> {post.orientation}
              </p>
            </div>
          
            <div className="space-y-2 flex text-base font-medium items-center justify-between">
              <p className="flex items-center ">
                <FontAwesomeIcon icon={faBed} className="mr-2 text-purple-500" />
                <span className="font-semibold mr-1">Số phòng ngủ: </span> {post.bedroom}
              </p>
              <p className="flex items-center">
                <FontAwesomeIcon icon={faBath} className="mr-2 text-teal-500" />
                <span className="font-semibold mr-1">Số phòng tắm: </span> {post.bathroom}
              </p>
            </div>
          </div>
          
          )}
         {post.estate_type === "Đất" && (
            <div className="grid p-1 text-gray-800 text-lg border border-[#3CA9F9] font-bold bg-white shadow-sm">
            <div className="flex justify-between items-center mb-4 ">
              <p className="text-emerald-500 text-lg font-semibold">
                <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
                Giá: {formatPrice(post.price)}
              </p>
              <p className="text-blue-500 text-lg">
                <FontAwesomeIcon icon={faRulerCombined} className="mr-2" />
                Diện tích: {post.area} m²
              </p>
            </div>
          
            <div className="space-y-2 text-base font-medium ">
              <p className="flex items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-600" />
                <span className="font-semibold ">Địa chỉ: {post.address}, Quận {post.district}, Thành phố {post.city}</span>
              </p>
              <p className="flex items-center">
                <FontAwesomeIcon icon={faCompass} className="mr-2 text-yellow-600" />
                <span className="font-semibold mr-1">Hướng nhà: </span> {post.orientation}
              </p>
            </div>
          
            <div className="space-y-2 flex text-base font-medium items-center justify-between">
              <p className="flex items-center ">
                <FontAwesomeIcon icon={faBed} className="mr-2 text-purple-500" />
                <span className="font-semibold mr-1">Số phòng ngủ: </span> {post.bedroom}
              </p>
              <p className="flex items-center">
                <FontAwesomeIcon icon={faBath} className="mr-2 text-teal-500" />
                <span className="font-semibold mr-1">Số phòng tắm: </span> {post.bathroom}
              </p>
            </div>
          </div>
          
          )}

          {/* Post */}
          {/* <DetailDescription
            className="min-h-[30rem]"
            description={post.description}
            maxLength={110}
            enableToggle={false}
            moreLink="/user/detail-post"
          /> */}
         
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
              <span>33</span>
            </div>
            {/* Chat */}
            <div className="flex items-center text-gray-500 space-x-1 gap-2">
              <FontAwesomeIcon icon={faComment} className="w-6 h-6" />
              <span>124</span>
            </div>
            {/* Share */}
            <div className="flex items-center text-gray-500 space-x-1 gap-2">
              <FontAwesomeIcon icon={faShareAlt} className="w-6 h-6" />
              <span>124</span>
            </div>
            {/* Save */}
            <div className="flex items-center text-gray-500 space-x-1 gap-2">
              <button onClick={handleSaveClick} className="focus:outline-none">
                <FontAwesomeIcon
                  icon={faBookmark}
                  className={`w-6 h-6 transition duration-100 ${
                    isSaved ? "text-yellow-400" : "text-gray-500"
                  }`}
                />
              </button>

              <span>2</span>
            </div>
          </div>

          {/* Neo_btn */}
          <div className="mt-2 flex justify-center items-center">
            <button className="bg-[#3CA9F9] text-white px-5 py-3 rounded-md">
              Thương lượng
            </button>
          </div>

         
        </div>
        
      </div>
     
      <div className="flex justify-between">
            {/* Profile Info */}
            <ProfileInformation
              name={post.user.username} 
              date={post.created_at} 
            />
            <div className="flex justify-end items-center">
              <span className="text-gray-500 w-[8rem] -mb-12 -mr-8 opacity-60">1239 lượt xem</span>
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
