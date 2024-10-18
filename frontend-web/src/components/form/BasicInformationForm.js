import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import AddressInput from "../map_api/AddressInputWithPopup";

const BasicInformation = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSelectProperty = (property) => {
    setSelectedProperty(property);
    setTimeout(() => {
      setShowForm(true);
      window.scrollTo({
        top: 200,
        behavior: "smooth",
      });
    }, 500);
  };

  return (
    <div className="mt-5 mb-[10rem] justify-center font-montserrat">
      <div className="flex items-center p-3 space-x-2 w-[20rem] shadow-lg shadow-[#E4FFFC] rounded-[3rem]">
        <FontAwesomeIcon
          icon={faPlus}
          className="text-white bg-[#3CA9F9] p-3 w-5 h-5 rounded-full"
        />
        <h3 className="text-2xl font-bold text-[#3CA9F9] underline">
          Tạo bài đăng
        </h3>
      </div>

      <div className="w-full p-8 mt-8 bg-gradient-to-r from-[#E4FFFC] via-blue-200 to-blue-400 rounded-xl shadow-xl transition-all duration-500 hover:shadow-2xl">
        <button
          className="block text-left"
          onClick={() => (window.location.href = "/user/create-post")}
        >
          <h2 className="text-[#3CA9F9] font-extrabold p-3">
            Chọn loại hình bất động sản:
          </h2>
        </button>

        <div className="flex flex-row justify-center gap-[7rem] pb-10">
          {/* Ảnh nhà */}
          <div
            className={`relative group transition-all duration-500 hover:-translate-y-2 rounded-[7rem] cursor-pointer ${
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
              className="w-[30rem] h-[20rem] object-cover rounded-[6rem] shadow-2xl m-5 group-hover:opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-2xl font-bold pointer-events-none">
                Bạn muốn bán nhà ?
              </span>
            </div>
          </div>

          {/* Ảnh đất */}
          <div
            className={`relative group transition-all duration-500 hover:-translate-y-2 rounded-[7rem] cursor-pointer ${
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
              className="w-[30rem] h-[20rem] object-cover rounded-[6rem] shadow-2xl m-5 group-hover:opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-white text-2xl font-bold pointer-events-none">
                Bạn muốn bán đất ?
              </span>
            </div>
          </div>
        </div>

        {/* Handle select */}
        {showForm && selectedProperty === "house" && (
          <div className="transition-all transform translate-y-[-20px]">
            <h2 className="text-xl font-bold text-[#3CA9F9] mb-10">
              Thông tin cơ bản
            </h2>
            <form className="p-6 rounded-lg shadow-lg bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Địa chỉ */}
                <div>
                  <label className="block mb-2 text-gray-700">Địa chỉ:</label>
                  <input
                    type="text"
                    className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Giá bán */}
                <div>
                  <label className="block mb-2 text-gray-700">Giá bán:</label>
                  <input
                    type="number"
                    className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Diện tích */}
                <div>
                  <label className="block mb-2 text-gray-700">Diện tích:</label>
                  <input
                    type="number"
                    className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tình trạng pháp lý */}
                <div>
                  <label className="block mb-2 text-gray-700">
                    Tình trạng pháp lý:
                  </label>
                  <select className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="so-hong">Sổ hồng</option>
                    <option value="so-do">Sổ đỏ</option>
                    <option value="chua-co">Chưa có</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>

                {/* Hướng */}
                <div>
                  <label className="block mb-2 text-gray-700">Hướng:</label>
                  <select className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="dong">Đông</option>
                    <option value="tay">Tây</option>
                    <option value="nam">Nam</option>
                    <option value="bac">Bắc</option>
                    <option value="dong-tay">Đông-Tây</option>
                    <option value="tay-nam">Tây-Nam</option>
                    <option value="dong-nam">Đông-Nam</option>
                    <option value="tay-bac">Tây-Bắc</option>
                  </select>
                </div>

                {/* Số tầng */}
                <div>
                  <label className="block mb-2 text-gray-700">Số tầng:</label>
                  <input
                    type="number"
                    className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Số phòng ngủ */}
                <div>
                  <label className="block mb-2 text-gray-700">
                    Số phòng ngủ:
                  </label>
                  <input
                    type="number"
                    className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Số phòng tắm */}
                <div>
                  <label className="block mb-2 text-gray-700">
                    Số phòng tắm:
                  </label>
                  <input
                    type="number"
                    className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Ghi chú */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-gray-700">Ghi chú:</label>
                  <textarea className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
              </div>
              <div className=" w-full flex justify-center">
                <button className="bg-[#3CA9F9] text-white font-semibold rounded-lg px-4 py-2 mt-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Đăng bài
                </button>
              </div>
            </form>
            <AddressInput />
          </div>
        )}

        {showForm && selectedProperty === "land" && (
          <div className="transition-all transform translate-y-[-20px]">
            <h2 className="text-xl font-bold text-[#3CA9F9]">
              Thông tin cơ bản
            </h2>
            <form className="p-6 rounded-lg shadow-lg bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Địa chỉ */}
                <div>
                  <label className="block mb-2 text-gray-700">Địa chỉ:</label>
                  <input
                    type="text"
                    className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Giá bán */}
                <div>
                  <label className="block mb-2 text-gray-700">Giá bán:</label>
                  <input
                    type="number"
                    className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Diện tích */}
                <div>
                  <label className="block mb-2 text-gray-700">Diện tích:</label>
                  <input
                    type="number"
                    className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tình trạng pháp lý */}
                <div>
                  <label className="block mb-2 text-gray-700">
                    Tình trạng pháp lý:
                  </label>
                  <select className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="so-hong">Sổ hồng</option>
                    <option value="so-do">Sổ đỏ</option>
                    <option value="chua-co">Chưa có</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>

                {/* Hướng */}
                <div>
                  <label className="block mb-2 text-gray-700">Hướng:</label>
                  <select className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="dong">Đông</option>
                    <option value="tay">Tây</option>
                    <option value="nam">Nam</option>
                    <option value="bac">Bắc</option>
                    <option value="dong-tay">Đông-Tây</option>
                    <option value="tay-nam">Tây-Nam</option>
                    <option value="dong-nam">Đông-Nam</option>
                    <option value="tay-bac">Tây-Bắc</option>
                  </select>
                </div>

                {/* Ghi chú */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-gray-700">Ghi chú:</label>
                  <textarea className="block w-full p-2 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
              </div>
              <div className=" w-full flex justify-center">
                <button className="bg-[#3CA9F9] text-white font-semibold rounded-lg px-4 py-2 mt-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Đăng bài
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInformation;
