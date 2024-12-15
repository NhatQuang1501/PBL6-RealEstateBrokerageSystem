import React, { useState, useEffect, useRef } from "react";
import avatar from "../../../assets/image/hero-bg12.jpg";

import { useNavigate } from "react-router-dom";

const HeaderAdmin = ({ isCollapsed }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); 

  const handleLogout = () => {
    clearUserSession();
    navigate("/authen/login");
  };

  const clearUserSession = () => {
    localStorage.removeItem("userToken");
  };

  
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`absolute top-3 flex justify-between items-center right-2 h-[58px] p-3 rounded-xl transition-width duration-300 bg-white ${
        isCollapsed ? "w-[92vw]" : "w-[76vw]"
      }`}
    >
      <div className="relative flex items-center w-[33%]">
        <svg
          className="absolute left-3 w-[20px] text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        </svg>
        <input
          type="text"
          placeholder="Tìm kiếm ..."
          className="pl-10 p-3 bg-[#9EBBD8] text-white placeholder-white placeholder-opacity-75 w-full rounded-md"
        />
      </div>

      <div className="relative flex items-center w-[150px]" ref={dropdownRef}>
        <svg className="w-[20px] mr-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416l400 0c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4l0-25.4c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112l0 25.4c0 47.9 13.9 94.6 39.7 134.6L72.3 368C98.1 328 112 281.3 112 233.4l0-25.4c0-61.9 50.1-112 112-112zm64 352l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
        </svg>
        <img
          className="w-[45px] h-[45px] object-cover rounded-full bg-white mr-3 ml-5 cursor-pointer"
          src={avatar}
          alt=""
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
          <div className="absolute top-10 right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
            <button
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
              onClick={() => navigate("/profile")}
            >
              Xem thông tin
            </button>
            <button
              className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderAdmin;
