import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faDollarSign,
  faRoad,
  faMapMarkerAlt,
  faCity,
  faRulerCombined,
  faFileAlt,
  faCompass,
  faBuilding,
  faBed,
  faRulerHorizontal,
  faBath,
  faHeading,
  faStickyNote,
} from "@fortawesome/free-solid-svg-icons";
import AddressInput from "../map_api/AddressInputWithPopup";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppProvider";

const House = ({
  handleSubmit,
  address,
  setAddress,
  district,
  setDistrict,
  city,
  setCity,
  price,
  setPrice,
  area,
  setArea,
  legal_status,
  setLegal_status,
  orientation,
  setOrientation,
  floor,
  setFloor,
  bedroom,
  setBedroom,
  bathroom,
  setBathroom,
  description,
  setDescription,
  frontage,
  setFrontage,
  title,
  setTitle,
}) => {
    
  return (
    <div className="transition-all transform translate-y-[-20px]">
      <h2 className="text-xl font-bold text-[#3CA9F9] mb-10">
        Thông tin cơ bản
      </h2>
      <form
        className="p-8 rounded-lg shadow-xl bg-gradient-to-r from-blue-50 to-blue-100"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Địa chỉ */}
          <div>
            {/* Tên đường */}
            <div className="relative mb-6">
              <label
                className="block mb-2 text-gray-800 font-semibold"
                htmlFor="address"
              >
                Tên đường:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="vd: 245 Hoàng Văn Thụ"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FontAwesomeIcon
                  icon={faRoad}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            {/* Quận */}
            <div className="relative mb-6">
              <label
                className="block mb-2 text-gray-800 font-semibold"
                htmlFor="district"
              >
                Quận:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="vd: Hải Châu"
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>

            {/* Thành phố */}
            <div className="relative mb-6">
              <label
                className="block mb-2 text-gray-800 font-semibold"
                htmlFor="city"
              >
                Thành phố:
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  required
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FontAwesomeIcon
                  icon={faCity}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Giá bán */}
          <div className="relative mb-6">
            <label
              className="block mb-2 text-gray-800 font-semibold"
              htmlFor="price"
            >
              Giá bán (VNĐ):
            </label>
            <div className="relative">
              <input
                type="number"
                required
                placeholder="vd: 5000000000"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FontAwesomeIcon
                icon={faDollarSign}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Diện tích */}
          <div className="relative mb-6">
            <label
              className="block mb-2 text-gray-800 font-semibold"
              htmlFor="area"
            >
              Diện tích (m2):
            </label>
            <div className="relative">
              <input
                type="number"
                required
                placeholder="vd: 100"
                min="0"
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FontAwesomeIcon
                icon={faRulerCombined}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Tình trạng pháp lý */}
          <div className="relative mb-6">
            <label
              className="block mb-2 text-gray-800 font-semibold"
              htmlFor="legal_status"
            >
              Tình trạng pháp lý:
            </label>
            <div className="relative">
              <select
                className="block w-full p-2 pl-10 border rounded transition duration-300 ease-in-out transform hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="legal_status"
                value={legal_status}
                onChange={(e) => setLegal_status(e.target.value)}
              >
                <option value="" disabled hidden>
                  Chọn tình trạng pháp lý
                </option>
                <option value="Sổ hồng">Sổ hồng</option>
                <option value="Sổ đỏ">Sổ đỏ</option>
                <option value="Chưa có">Chưa có</option>
                <option value="Khác">Khác</option>
              </select>
              <FontAwesomeIcon
                icon={faFileAlt}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Hướng */}
          <div className="relative mb-6">
            <label
              className="block mb-2 text-gray-800 font-semibold"
              htmlFor="orientation"
            >
              Hướng nhà:
            </label>
            <div className="relative">
              <select
                className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="orientation"
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
              >
                <option value="" disabled hidden>
                  Chọn hướng nhà
                </option>
                <option value="Đông">Đông</option>
                <option value="Tây">Tây</option>
                <option value="Nam">Nam</option>
                <option value="Bắc">Bắc</option>
                <option value="Đông-Bắc">Đông-Bắc</option>
                <option value="Đông-Nam">Đông-Nam</option>
                <option value="Tây-Bắc">Tây-Bắc</option>
                <option value="Tây-Nam">Tây-Nam</option>
              </select>
              <FontAwesomeIcon
                icon={faCompass}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Số tầng */}
          <div className="relative mb-6">
            <label
              className="block mb-2 text-gray-800 font-semibold"
              htmlFor="floor"
            >
              Số tầng:
            </label>
            <div className="relative">
              <input
                type="number"
                required
                placeholder="vd: 2"
                min="0"
                id="floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FontAwesomeIcon
                icon={faBuilding}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Số phòng ngủ */}
          <div className="relative mb-6">
            <label
              className="block mb-2 text-gray-800 font-semibold"
              htmlFor="bedroom"
            >
              Số phòng ngủ:
            </label>
            <div className="relative">
              <input
                type="number"
                required
                placeholder="vd: 3"
                min="0"
                id="bedroom"
                value={bedroom}
                onChange={(e) => setBedroom(e.target.value)}
                className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FontAwesomeIcon
                icon={faBed}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Mặt tiền */}
          <div className="relative mb-6">
            <label
              className="block mb-2 text-gray-800 font-semibold"
              htmlFor="frontage"
            >
              Mặt tiền (m):
            </label>
            <div className="relative">
              <input
                type="number"
                required
                placeholder="vd: 5.5"
                min="0"
                id="frontage"
                value={frontage}
                onChange={(e) => setFrontage(e.target.value)}
                className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FontAwesomeIcon
                icon={faRulerHorizontal}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Số phòng tắm */}
          <div className="relative mb-6">
            <label
              className="block mb-2 text-gray-800 font-semibold"
              htmlFor="bathroom"
            >
              Số phòng tắm:
            </label>
            <div className="relative">
              <input
                type="number"
                required
                placeholder="vd: 2"
                min="0"
                id="bathroom"
                value={bathroom}
                onChange={(e) => setBathroom(e.target.value)}
                className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FontAwesomeIcon
                icon={faBath}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Tiêu đề bài đăng */}
          <div className="relative mb-6 md:col-span-2">
            <label
              className="block mb-2 text-gray-800 font-semibold"
              htmlFor="title"
            >
              Tiêu đề bài đăng:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="vd: Bán nhà 3 tầng ở Đà Nẵng"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FontAwesomeIcon
                icon={faHeading}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div className="relative mb-6 md:col-span-2">
            <label
              className="block mb-2 text-gray-800 font-semibold"
              htmlFor="description"
            >
              Ghi chú:
            </label>
            <div className="relative">
              <textarea
                className="block w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                placeholder="Nhập ghi chú cho bài đăng của bạn"
                id="description"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <FontAwesomeIcon
                icon={faStickyNote}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>
        </div>
        <div className=" w-full flex justify-center">
          <button
            className="bg-[#3CA9F9] text-white font-semibold rounded-lg px-4 py-2 mt-4 transition duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            // onClick={handleSubmit}
            type="submit"
          >
            Đăng bài
          </button>
        </div>
      </form>
      <AddressInput />
    </div>
  );
};

export default House;
