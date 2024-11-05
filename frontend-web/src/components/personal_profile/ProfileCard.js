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
} from "@fortawesome/free-solid-svg-icons";

const ProfileCard = () => {
  const navigate = useNavigate();
  const { id, sessionToken } = useAppContext();
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [fileName, setFileName] = useState("Choose a file");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const { userId } = useParams();

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
          url = `http://127.0.0.1:8000/auth/users/${userId}/`;
        } else {
          url = `http://127.0.0.1:8000/auth/users/${id}/`;
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
          url = `http://127.0.0.1:8000/auth/users-avatar/${userId}/`;
        } else {
          url = `http://127.0.0.1:8000/auth/users-avatar/${id}/`;
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
  }, [id]);

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
        alert("Please upload a .png or .jpg image.");
        fileInputRef.current.value = ""; // Reset file input
        setFileName("Choose a file"); // Reset file name display
        return;
      }

      const fileSizeLimit = 25 * 1024 * 1024;
      if (file.size > fileSizeLimit) {
        alert("File size should not exceed 25 MB.");
        fileInputRef.current.value = "";
        setFileName("Choose a file");
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
        `http://127.0.0.1:8000/auth/users-avatar/`,
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
    <div className="bg-[#FBBF24] text-white p-6 rounded-lg shadow-lg">
      {/* Profile Image */}
      <div className="mb-4 flex flex-col justify-center">
        <div className="grid justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt="profile"
              className="rounded-full w-[12rem] h-[12rem] object-contain bg-gray-500"
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
                className="p-1 text-sm bg-white font-bold text-blue-600 rounded-lg mt-2 hover:shadow-lg hover:bg-blue-200"
                onClick={() => fileInputRef.current.click()}
              >
                Thay đổi ảnh đại diện
              </button>

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageUpload} // Gọi handleImageUpload khi người dùng chọn file
              />
            </>
          ) : (
            <>
              <button
                className="p-1 text-sm bg-white font-bold text-blue-600 rounded-lg mt-2 hover:shadow-lg hover:bg-blue-200"
                // onClick={() => fileInputRef.current.click()}
              >
                Bạn bè
              </button>

            </>
          )}
        </div>
      </div>
      {!userId || userId === id ? (
        <>
          {/* Contact Button */}
          <button
            className="bg-teal-500 px-4 py-2 rounded-lg w-full mb-4"
            onClick={() => handleUpdateProfile()}
          >
            Cập nhật trang cá nhân
          </button>
        </>
      ) : (
        <>
          {/* Contact Button */}
          <button
            className="bg-blue-500 px-4 py-2 rounded-lg w-full mb-4"
            // onClick={() => handleUpdateProfile()}
          >
            Nhắn tin
          </button>
        </>
      )}

      {/* Face Customizer Options */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="mb-4 text-xl font-semibold text-gray-800">
          Thông tin người dùng
        </p>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.user.username)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.user.email)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.fullname)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPhone} className="text-blue-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.phone_number)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faCity} className="text-blue-500 mr-2" />
            <label className="flex items-center text-gray-700">
              {getDisplayValue(user.city)}
            </label>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon
              icon={faBirthdayCake}
              className="text-blue-500 mr-2"
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
