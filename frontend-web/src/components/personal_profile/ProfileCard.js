/* eslint-disable no-unused-vars */
// components/ProfileCard.js
import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import { useState } from "react";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faCity,
  faBirthdayCake,
  faUserEdit,
  faCamera,
  faBan,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { FaAddressCard } from "react-icons/fa";

const ProfileCard = ({ openLockPopup_, openUnLockPopup_ }) => {
  const navigate = useNavigate();
  const { id, sessionToken, role } = useAppContext();
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [fileName, setFileName] = useState("Hãy chọn file ảnh");
  const [avatar, setAvatar] = useState(null);
  const { userId } = useParams();
  const [lockedAccounts, setLockedAccounts] = useState([]);

  const handleUpdateProfile = () => {
    console.log("Update Profile");
    navigate("/user/update-profile");
  };

  useEffect(() => {
    console.log("My ID:", id);
    console.log("User ID:", userId);
    const fetchUserById = async () => {
      try {
        let url;
        if (userId) {
          url = `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/users/${userId}/`;
        } else {
          url = `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/users/${id}/`;
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        console.log("User data:", data);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUserById();

    // ava
    const fetchAvatar = async () => {
      try {
        let url;
        if (userId) {
          url = `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/users-avatar/${userId}/`;
        } else {
          url = `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/users-avatar/${id}/`;
        }
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response);
        if (response.data.avatar_url === null) {
          response.data.avatar_url =
            "https://th.bing.com/th/id/OIP.Kt4xItiSOKueszQh9UysdgAAAA?w=465&h=465&rs=1&pid=ImgDetMain";
        }
        setAvatar(response.data.avatar_url);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    fetchAvatar();

    // Fetch locked accounts
    const fetchLockedAccounts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/lock-users/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        });
        const data = await res.json();
        setLockedAccounts(data.data.map((item) => item.profile.user_id));
      } catch (err) {
        console.log(err);
      }
    };
    fetchLockedAccounts();
  }, [id, userId, sessionToken]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const getDisplayValue = (value) => {
    return value ? (
      value
    ) : (
      <span className="text-gray-400 italic">Chưa cập nhật thông tin</span>
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType !== "image/png" && fileType !== "image/jpeg") {
        alert("Hãy tải ảnh với định dạng `.png` hoặc `.jpg`.");
        fileInputRef.current.value = ""; // Reset file input
        setFileName("Hãy chọn file ảnh"); // Reset file name display
        return;
      }

      const fileSizeLimit = 25 * 1024 * 1024;
      if (file.size > fileSizeLimit) {
        alert("File ảnh không được quá 25 MB.");
        fileInputRef.current.value = "";
        setFileName("Hãy chọn file ảnh");
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      updateAvatar(file);
    }
  };

  const updateAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/auth/users-avatar/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      console.log("Avatar updated successfully:", response.data);
      alert("Ảnh đại diện được tải lên thành công !");
      setAvatar(response.data.avatar_url);
      window.location.reload();
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Tải ảnh đại diện thất bại !");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-200 to-blue-300 text-white p-6 rounded-lg shadow-lg">
      {/* Profile Image */}
      <div className="mb-4 flex flex-col justify-center">
        <div className="grid justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt="profile"
              className="rounded-full w-[12rem] h-[12rem] object-cover bg-gray-300 border-[3px] border-gray-200 border-solid shadow-lg"
            />
          ) : (
            <img
              //Ảnh thay thế
              src="https://th.bing.com/th/id/OIP.PVzhiWdGqLXudD0PNtsMtwHaHa?w=980&h=980&rs=1&pid=ImgDetMain"
              alt="profile"
              className="rounded-full w-[12rem] h-[12rem] object-cover"
            />
          )}

          {!userId || userId === id ? (
            <>
              <button
                className="p-1 text-sm bg-white font-bold text-gray-600 rounded-lg mt-2 pr-2 hover:shadow-lg hover:bg-gray-200 flex items-center gap-2"
                onClick={() => fileInputRef.current.click()}
              >
                <FontAwesomeIcon icon={faCamera} className="ml-2" />{" "}
                {/* Thêm biểu tượng */}
                Thay đổi ảnh đại diện
              </button>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </>
          ) : (
            // lock/unlock account
            <>
              {role === "admin" && (
                <>
                  {lockedAccounts.includes(userId) ? (
                    <button
                      className="p-1 text-sm bg-yellow-500 font-bold text-black rounded-lg mt-2 pr-2 hover:shadow-lg hover:bg-yellow-600 flex items-center justify-center gap-2"
                      onClick={() => openUnLockPopup_(userId)}
                    >
                      <FontAwesomeIcon icon={faUnlock} className="" />{" "}
                      {/* Thêm biểu tượng */}
                      Mở khóa tài khoản
                    </button>
                  ) : (
                    <button
                      className="p-1 text-sm bg-red-600 font-bold text-white rounded-lg mt-2 pr-2 hover:shadow-lg hover:bg-red-700 flex items-center justify-center gap-2"
                      onClick={() => openLockPopup_(userId)}
                    >
                      <FontAwesomeIcon icon={faBan} className="" />{" "}
                      {/* Thêm biểu tượng */}
                      Khóa tài khoản
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {!userId || userId === id ? (
        <>
          {/* Contact Button */}
          <button
            className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 text-black font-bold px-4 py-2 rounded-lg w-full mb-4 shadow-lg hover:shadow-xl hover:from-gray-500 hover:to-gray-600 hover:text-white border-[1px] border-white border-solid transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            onClick={() => handleUpdateProfile()}
          >
            <FontAwesomeIcon icon={faUserEdit} /> {/* Thêm biểu tượng */}
            Cập nhật trang cá nhân
          </button>
        </>
      ) : null}

      {/* Face Customizer Options */}
      <div className="p-5 bg-[#fafffe] rounded-lg shadow-md">
        <p className="mb-4 text-xl font-semibold text-gray-800">
          Thông tin người dùng
        </p>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.user.username)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.user.email)}
            </label>
          </div>
          <div className="flex items-center">
            <FaAddressCard className="text-gray-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.fullname)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPhone} className="text-gray-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.phone_number)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCity} className="text-gray-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.city)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faBirthdayCake}
              className="text-gray-500 mr-2"
            />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.birthdate)}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
