import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShareAlt,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";

import ProfileInformmation from "../profile_information/ProfileInformation";

function Post() {
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

  return (
    <div className="w-[97%] mx-auto p-[1rem] bg-white rounded-lg shadow-md border-2 border-[#3CA9F9] border-double overflow-hidden font-montserrat">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white">
        <h2 className="text-xl font-semibold text-[#3CA9F9]">
          Bán nhà ở tại 123 Tôn Đức Thắng
        </h2>
        <button className="px-5 py-2 text-[#3CA9F9] border border-[#3CA9F9] rounded-[0.5rem]">
          Đang bán
        </button>
      </div>

      {/* main_container */}
      <div className="flex flex-row px-2 py-2">
        {/* Left (40%) */}
        <div className="w-[45%] pr-4">
          {/* Img */}
          <img
            className="w-full h-[75%] object-cover rounded-md"
            src="https://th.bing.com/th/id/OIP.c_e6N6YtIVI2NFhW_Ugm6wHaF7?w=246&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="room_image"
          />

          {/* Profile Info */}
          <ProfileInformmation />
        </div>

        {/* Right column (60%) */}
        <div className="flex flex-col justify-between w-[55%] pl-4">
          <div className="grid grid-cols-2 gap-4 p-5 text-gray-700 text-lg border-2 border-[#DCDCDC] border-double rounded-lg pb-[5rem] font-bold">
            <div>
              <p className="text-red-600">12 tỷ VND</p>
              <p>Hải Châu, Đà Nẵng</p>
              <p>5 phòng ngủ</p>
            </div>
            <div>
              <p className="text-red-600">1000m²</p>
              <p>Đông Nam</p>
              <p>5 phòng tắm</p>
            </div>
          </div>

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

export default Post;
