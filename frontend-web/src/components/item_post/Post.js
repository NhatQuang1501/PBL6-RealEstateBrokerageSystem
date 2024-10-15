import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShareAlt,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";

function Post() {
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    setTimeout(() => {
      setIsClicked(!isClicked);
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
          <div className="flex items-center mt-4">
            <img
              className="w-12 h-12 rounded-full mr-3 object-cover"
              src="https://i.ytimg.com/vi/EgkK6HfSOLY/hqdefault.jpg"
              alt="avatar"
            />
            <div className="text-sm">
              <p className="font-semibold">Nguyễn Văn A</p>
              <p className="text-gray-500">12:00 pm 09/10/2024</p>
            </div>
            <div className="flex space-x-8 justify-center items-center pl-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#3CA9F9"
                className="size-7"
              >
                <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#3CA9F9"
                className="size-7"
              >
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
              </svg>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#3CA9F9"
                className="size-7"
              >
                <path
                  fillRule="evenodd"
                  d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a9.75 9.75 0 0 1 6.725.738l.108.054A8.25 8.25 0 0 0 18 4.524l3.11-.732a.75.75 0 0 1 .917.81 47.784 47.784 0 0 0 .005 10.337.75.75 0 0 1-.574.812l-3.114.733a9.75 9.75 0 0 1-6.594-.77l-.108-.054a8.25 8.25 0 0 0-5.69-.625l-2.202.55V21a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 3 2.25Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
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
              <FontAwesomeIcon icon={faBookmark} className="w-8 h-8" />
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
