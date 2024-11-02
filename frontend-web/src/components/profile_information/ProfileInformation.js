import React, { useState, useEffect, useRef } from "react";
import {
  faEllipsisV,
  faUser,
  faComment,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ProfileInformation = ({ name, date }) => {
  const postDate = new Date(date);
  const currentDate = new Date();
  const timeDifference = currentDate - postDate; // Thời gian chênh lệch tính bằng milliseconds

  // Chuyển đổi thời gian chênh lệch sang phút, giờ, và ngày
  const minutes = Math.floor(timeDifference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Tạo thông báo về thời gian đăng bài
  let timeDisplay = "";
  if (days < 3) {
    if (days >= 2) {
      timeDisplay = `${days} ngày trước vào lúc ${postDate.toLocaleTimeString(
        "vi-VN",
        { hour: "2-digit", minute: "2-digit" }
      )}`;
    } else if (days === 1) {
      timeDisplay = `Hôm qua vào lúc ${postDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (hours >= 1) {
      timeDisplay = `${hours} giờ trước`;
    } else if (minutes >= 1) {
      timeDisplay = `${minutes} phút trước`;
    } else {
      timeDisplay = "Vừa mới đăng";
    }
  } else {
    timeDisplay = `${postDate.toLocaleDateString(
      "vi-VN"
    )} vào lúc ${postDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  const [color, setColor] = useState("#3CA9F9");
  const [isOpen, setIsOpen] = useState(false);

  const handleReportClick = () => {
    setColor((prevColor) => (prevColor === "#3CA9F9" ? "red" : "#3CA9F9"));
  };

  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Đóng menu khi nhấn ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Profile Info */}

      <div className="flex items-center mt-1">
        <img
          className="w-10 h-10 rounded-full mr-3 object-cover"
          src="https://i.ytimg.com/vi/EgkK6HfSOLY/hqdefault.jpg"
          alt="avatar"
        />
        <div className="flex flex-col ">
          <p className="font-extrabold text-[#3CA9F9] text-[1.1rem]">{name}</p>
          <p className="text-gray-600 text-sm mt-2 opacity-60 text-[12px]">
            <span className="font-semibold">Đã đăng:</span> {timeDisplay}
          </p>
        </div>

        <div className="relative flex items-center  ml-9">
          {/* Icon dấu ba chấm dọc */}
          <button onClick={toggleMenu} className="focus:outline-none p-3">
            <FontAwesomeIcon
              icon={faEllipsisV}
              className="text-gray-600 text-xl cursor-pointer opacity-50"
            />
          </button>

          {/* Menu hiện ra khi nhấn vào dấu ba chấm */}
          {isOpen && (
            <div
              ref={menuRef}
              className="absolute left-5 bottom-3 mt-2 w-56 p-2 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col space-y-2 z-50"
            >
              <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md">
                <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                <span className="text-gray-700">Thông tin cá nhân</span>
              </button>
              <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md">
                <FontAwesomeIcon icon={faComment} className="text-green-500" />
                <span className="text-gray-700">Nhắn tin với người này</span>
              </button>
              <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md">
                <FontAwesomeIcon icon={faFlag} className="text-red-500" />
                <span className="text-gray-700">Báo cáo</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
