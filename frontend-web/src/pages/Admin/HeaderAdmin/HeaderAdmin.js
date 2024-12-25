import React, { useState, useEffect, useRef } from "react";
import avatar from "../../../assets/image/hero-bg12.jpg";

import { useNavigate } from "react-router-dom";
import NotifyAdmin from "../../../components/Notification/NotifyAdmin";

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
        <NotifyAdmin />
        <img
          className="w-[45px] h-[45px] object-cover rounded-full bg-white mr-3 ml-5 cursor-pointer"
          src={avatar}
          alt=""
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
          <div className="absolute top-10 right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
            <button
              className="block px-2 py-2 bg-blue-100 rounded-md font-semibold text-red-600 hover:bg-red-100 w-full text-center"
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
