import React from "react";

function Post() {
  return (
    <div className="w-[97%] mx-auto p-[1rem] bg-white rounded-lg shadow-md border border-[#3CA9F9] overflow-hidden font-montserrat">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-white border-white">
        <h2 className="text-xl font-semibold text-[#3CA9F9]">
          Bán nhà ở tại 123 Tôn Đức Thắng
        </h2>
        <button className="px-5 py-2 text-[#3CA9F9] border border-[#3CA9F9] rounded-[0.5rem]">
          Chưa bán
        </button>
      </div>

      {/* main_container */}
      <div className="flex flex-row px-6 py-4">
        {/* Left (40%) */}
        <div className="w-2/5 pr-4">
          {/* Img */}
          <img
            className="w-full h-auto object-cover rounded-md"
            src="https://th.bing.com/th/id/OIP.c_e6N6YtIVI2NFhW_Ugm6wHaF7?w=246&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="room_image"
          />

          {/* Profile Info */}
          <div className="flex items-center mt-4">
            <img
              className="w-12 h-12 rounded-full mr-3"
              src="https://i.ytimg.com/vi/EgkK6HfSOLY/hqdefault.jpg"
              alt="avatar"
            />
            <div className="text-sm">
              <p className="font-semibold">Nguyễn Văn A</p>
              <p className="text-gray-500">12:00 pm 09/10/2024</p>
            </div>
          </div>
        </div>

        {/* Right column (60%) */}
        <div className="w-3/5 pl-4">
          <div className="grid grid-cols-2 gap-4 text-gray-700 text-lg">
            <div>
              <p className="text-red-600 font-semibold">12 tỷ VND</p>
              <p>Hải Châu, Đà Nẵng</p>
              <p>5 phòng ngủ</p>
            </div>
            <div>
              <p className="text-red-600 font-semibold">1000m²</p>
              <p>Đông Nam</p>
              <p>5 phòng tắm</p>
            </div>
          </div>

          {/* Interaction buttons */}
          <div className="flex space-x-6 mt-4">
            <div className="flex items-center text-gray-500 space-x-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span>33</span>
            </div>
            <div className="flex items-center text-gray-500 space-x-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 8h10M7 12h4m1 8H6a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v7"
                ></path>
              </svg>
              <span>124</span>
            </div>
            <div className="flex items-center text-gray-500 space-x-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 10h16M10 16l4-4m0 0l-4-4m4 4H6"
                ></path>
              </svg>
              <span>124</span>
            </div>
            <div className="flex items-center text-gray-500 space-x-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 20h14l-7-8-7 8z"
                ></path>
              </svg>
              <span>2</span>
            </div>
          </div>

          {/* Neo_btn */}
          <div className="mt-4 flex justify-between items-center">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Thương lượng
            </button>
          </div>
        </div>
        <span className="text-gray-500 self-end w-[8rem]">1239 lượt xem</span>
      </div>
    </div>
  );
}

export default Post;
