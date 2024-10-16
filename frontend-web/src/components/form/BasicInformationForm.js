import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const BasicInformation = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSelectProperty = (property) => {
    setSelectedProperty(property);
    setTimeout(() => {
      setShowForm(true);
      window.scrollTo({
        top: 200, // Cuộn lên 1 xíu
        behavior: "smooth", // Hiệu ứng mượt
      });
    }, 500); // Đợi chút cho ảnh hoàn tất hiệu ứng
  };

  return (
    <div className="mt-5 justify-center font-montserrat">
      {/* Icon thêm bài đăng */}
      <div className="flex items-center p-3 space-x-2 w-[20rem] shadow-lg shadow-[#E4FFFC] rounded-[3rem]">
        <FontAwesomeIcon
          icon={faPlus}
          className="text-white bg-[#3CA9F9] p-3 w-5 h-5 rounded-full"
        />
        <h3 className="text-2xl font-bold text-[#3CA9F9] underline">
          Tạo bài đăng
        </h3>
      </div>

      <div className="w-full p-8 mt-8 bg-[#E4FFFC] border border-[#3CA9F9] rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl">
        <button
          className="block text-left"
          onClick={() => (window.location.href = "#")}
        >
          <h2 className="text-[#3CA9F9] font-extrabold p-3">
            Chọn loại hình bất động sản:
          </h2>
        </button>

        <div className="flex flex-row justify-center gap-[8rem] pb-10">
          {/* Ảnh nhà */}
          <div
            className={`relative group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 rounded-[7rem] cursor-pointer ${
              selectedProperty === "house"
                ? "translate-x-[60%] scale-100"
                : selectedProperty
                ? "opacity-0 translate-x-[20rem]"
                : ""
            }`}
            onClick={() => handleSelectProperty("house")}
            style={{
              visibility:
                selectedProperty === "house" || !selectedProperty
                  ? "visible"
                  : "hidden",
            }}
          >
            <img
              src="https://th.bing.com/th/id/R.d2a57ccd3e425a765264c5f40c30ee59?rik=H5TNgjOrf5EDRA&pid=ImgRaw&r=0"
              alt="room_image"
              className="w-[30rem] h-[20rem] object-cover rounded-[6rem] shadow-sm m-5 group-hover:opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-2xl font-bold pointer-events-none">
                Bạn muốn bán nhà ?
              </span>
            </div>
          </div>

          {/* Ảnh đất */}
          <div
            className={`relative group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 rounded-[7rem] cursor-pointer ${
              selectedProperty === "land"
                ? "translate-x-[-60%] scale-100"
                : selectedProperty
                ? "opacity-0 -translate-x-[20rem]"
                : ""
            }`}
            onClick={() => handleSelectProperty("land")}
            style={{
              visibility:
                selectedProperty === "land" || !selectedProperty
                  ? "visible"
                  : "hidden",
            }}
          >
            <img
              src="https://static.chotot.com/storage/chotot-kinhnghiem/nha/2021/12/b039cc56-ban-dat-1-e1638373452143.webp"
              alt="room_image"
              className="w-[30rem] h-[20rem] object-cover rounded-[6rem] shadow-sm m-5 group-hover:opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-2xl font-bold pointer-events-none">
                Bạn muốn bán đất ?
              </span>
            </div>
          </div>
        </div>

        {/* Hiển thị form tương ứng */}
        {showForm && selectedProperty === "house" && (
          <div className="transition-all transform translate-y-[-20px]">
            <h2 className="text-xl font-bold text-[#3CA9F9]">
              Form đăng tin bán nhà
            </h2>
            <form>
              {/* Các trường thông tin dành cho nhà */}
              <label className="block mb-2 text-gray-700">Địa chỉ:</label>
              <input
                type="text"
                className="block w-full p-2 border rounded mb-4"
              />
              <label className="block mb-2 text-gray-700">Giá bán:</label>
              <input
                type="text"
                className="block w-full p-2 border rounded mb-4"
              />
              <label className="block mb-2 text-gray-700">Số tầng:</label>
              <input
                type="number"
                className="block w-full p-2 border rounded mb-4"
              />
              <label className="block mb-2 text-gray-700">Số phòng ngủ:</label>
              <input
                type="number"
                className="block w-full p-2 border rounded mb-4"
              />
              <label className="block mb-2 text-gray-700">Số phòng tắm:</label>
              <input
                type="number"
                className="block w-full p-2 border rounded mb-4"
              />
            </form>
          </div>
        )}

        {showForm && selectedProperty === "land" && (
          <div className="transition-all transform translate-y-[-20px]">
            <h2 className="text-xl font-bold text-[#3CA9F9]">
              Form đăng tin bán đất
            </h2>
            <form>
              {/* Các trường thông tin dành cho đất */}
              <label className="block mb-2 text-gray-700">Địa chỉ:</label>
              <input
                type="text"
                className="block w-full p-2 border rounded mb-4"
              />
              <label className="block mb-2 text-gray-700">Giá bán:</label>
              <input
                type="text"
                className="block w-full p-2 border rounded mb-4"
              />
              <label className="block mb-2 text-gray-700">
                Tình trạng giấy tờ:
              </label>
              <input
                type="text"
                className="block w-full p-2 border rounded mb-4"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInformation;
