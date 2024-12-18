import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PredictLandPrice from "../../components/predict/PredictLandPrice";
import backgroundVideo from "../../assets/video/Xám và Trắng Doanh nghiệp Bất động sản Thương mại Video Trình chiếu.mp4";
import { MdLandscape, MdOutlineHouse, MdArrowBack } from "react-icons/md";
import PredictHousePrice from "../../components/predict/PredictHousePrice";

function Predict() {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div className="relative min-h-screen flex flex-col items-center p-6 overflow-hidden font-montserrat">
      {/* Nút Quay Về */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 z-20 bg-white bg-opacity-70 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-md transition duration-300 cursor-pointer"
      >
        <MdArrowBack className="text-2xl" />
      </button>

      {/* Video nền */}
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
      >
        <source src={backgroundVideo} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>

      {/* Lớp phủ Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] opacity-40 z-0"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row items-center md:items-start">
        {/* Bên trái: Tiêu đề, mô tả, nút chọn */}
        <div className="md:w-1/2 text-center md:text-left text-gray-800 p-4 mt-[5rem]">
          <h1 className="text-6xl font-extrabold mb-6 drop-shadow-md">
            Dự Đoán Giá Bất Động Sản
          </h1>
          <p className="text-lg font-bold mb-8">
            Sử dụng công nghệ AI để dự đoán giá trị bất động sản chính xác,
            nhanh chóng và đáng tin cậy.
          </p>

          {/* Thêm 2 nút */}
          <div className="flex space-x-6 mb-8 justify-center md:justify-start">
            <button
              onClick={() => setSelectedOption("land")}
              className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedOption === "land"
                  ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg scale-105"
                  : "bg-white text-blue-600 border border-blue-600 hover:bg-gradient-to-r hover:from-green-400 hover:to-blue-500 hover:text-white"
              }`}
            >
              <MdLandscape className="mr-2 text-xl" />
              <span>Dự Đoán Đất</span>
            </button>
            <button
              onClick={() => setSelectedOption("house")}
              className={`flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedOption === "house"
                  ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg scale-105"
                  : "bg-white text-pink-600 border border-pink-600 hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-500 hover:text-white"
              }`}
            >
              <MdOutlineHouse className="mr-2 text-xl" />
              <span>Dự Đoán Nhà</span>
            </button>
          </div>
        </div>

        {/* Bên phải: PredictLandPrice hoặc thông báo */}
        <div className="md:w-1/2 p-4">
          {selectedOption === "land" && (
            <div className="ml-[5rem]">
              <PredictLandPrice />
            </div>
          )}
          {selectedOption === "house" && (
            <div className="ml-[5rem]">
              <PredictHousePrice />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Predict;
