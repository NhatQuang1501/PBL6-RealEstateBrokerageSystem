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
} from "@fortawesome/free-solid-svg-icons";
import { FaAddressCard } from "react-icons/fa";

const ProfileCard = () => {
  const navigate = useNavigate();
  const { id, sessionToken, role } = useAppContext();
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [fileName, setFileName] = useState("Hãy chọn file ảnh");
  const [avatar, setAvatar] = useState(null);
  const { userId } = useParams();
  const [lockedAccounts, setLockedAccounts] = useState([]);
  const [isLockPopupOpen, setIsLockPopupOpen] = useState(false);
  const [isUnLockPopupOpen, setIsUnLockPopupOpen] = useState(false);

  const [lockedReason, setLockedReason] = useState(
    "Ngôn từ không phù hợp với chính sách của hệ thống"
  );
  const [unlockDate, setUnlockDate] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

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

    // Fetch locked accounts
    const fetchLockedAccounts = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/auth/lock-users/", {
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

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Lock account
  const handleLockAccount = async (userId, lockedReason, unlockDate) => {
    const formattedUnlockDate = formatDateTime(unlockDate);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/auth/lock-users/${userId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            locked_reason: lockedReason,
            unlocked_date: formattedUnlockDate,
            // locked_reason: "Ngôn từ không phù hợp với chính sách của hệ thống",
            // unlocked_date: "2024-12-09 12:03:00",
          }),
        }
      );
      if (res.ok) {
        console.log("Khóa tài khoản thành công");
        alert("Khóa tài khoản thành công");
        closeLockPopup();
        setLockedAccounts([...lockedAccounts, userId]);
      } else {
        alert("Khóa tài khoản thất bại");
        console.log("Khóa tài khoản thất bại");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Mở popup khóa tài khoản
  const openLockPopup_ = (userId) => {
    setSelectedUserId(userId);
    setIsLockPopupOpen(true);
  };

  // Đóng popup khóa tài khoản
  const closeLockPopup = () => {
    setIsLockPopupOpen(false);
    setLockedReason("");
    setUnlockDate("");
    setSelectedUserId(null);
  };

  const handleUnlockDateChange = (e) => {
    const selectedDate = e.target.value;
    setUnlockDate(selectedDate);

    const now = new Date();
    const selectedDateTime = new Date(selectedDate);

    if (selectedDateTime <= now) {
      alert(
        "Ngày mở khóa phải là một thời điểm trong tương lai. Vui lòng chọn lại."
      );
      setUnlockDate("");
    }
  };

  // Mở popup mở khóa tài khoản
  const openUnLockPopup_ = (userId) => {
    setSelectedUserId(userId);
    setIsUnLockPopupOpen(true);
  };

  // Đóng popup mở khóa tài khoản
  const closeUnLockPopup = () => {
    setIsUnLockPopupOpen(false);
    setSelectedUserId(null);
  };

  const handleUnLockAccount = async (userId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/auth/unlock-users/${userId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      if (res.ok) {
        console.log("Mở khóa tài khoản thành công");
        alert("Mở khóa tài khoản thành công");
        closeUnLockPopup();
        setLockedAccounts(lockedAccounts.filter((id) => id !== userId));
      } else {
        alert("Mở khóa tài khoản thất bại");
        console.log("Mở khóa tài khoản thất bại");
      }
    } catch (err) {
      console.log(err);
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
                      <FontAwesomeIcon icon={faBan} className="ml-2" />{" "}
                      {/* Thêm biểu tượng */}
                      Mở khóa tài khoản
                    </button>
                  ) : (
                    <button
                      className="p-1 text-sm bg-red-600 font-bold text-white rounded-lg mt-2 pr-2 hover:shadow-lg hover:bg-red-700 flex items-center justify-center gap-2"
                      onClick={() => openLockPopup_(userId)}
                    >
                      <FontAwesomeIcon icon={faBan} className="ml-2" />{" "}
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

      {/* Popup khóa tài khoản */}
      {isLockPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center border-b-[2px] border-solid border-gray-500">
              Khóa tài khoản
            </h2>
            <div className="mb-6">
              <label className="block text-gray-700 mb-3 font-bold">
                Lý do khóa tài khoản:
              </label>
              {/* Thẻ lý do */}
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  "Ngôn từ không phù hợp",
                  "Spam nội dung",
                  "Hành vi gian lận",
                  "Vi phạm điều khoản",
                  "Khác",
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    className={`px-3 py-1 rounded-full border ${
                      lockedReason === reason
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-gray-200 text-gray-700 border-gray-300"
                    }`}
                    onClick={() => setLockedReason(reason)}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              {/* Ô nhập lý do */}
              <textarea
                value={lockedReason}
                onChange={(e) => setLockedReason(e.target.value)}
                className="w-full mt-1 p-3 border rounded resize-none"
                rows="4"
                placeholder="Nhập lý do khóa tài khoản"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-bold">
                Ngày mở khóa:
              </label>
              <input
                type="datetime-local"
                value={unlockDate}
                onChange={handleUnlockDateChange}
                className="w-full mt-1 p-2 border rounded"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 font-semibold"
                onClick={closeLockPopup}
              >
                Hủy
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold"
                onClick={() =>
                  handleLockAccount(selectedUserId, lockedReason, unlockDate)
                }
              >
                Khóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup mở khóa tài khoản */}
      {isUnLockPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center border-b-[2px] border-solid border-gray-500">
              Mở khóa tài khoản
            </h2>
            <p className="mb-6 text-center font-semibold">
              Bạn có chắc chắn muốn mở khóa tài khoản này không?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 font-semibold"
                onClick={closeLockPopup}
              >
                Hủy
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold"
                onClick={() => handleUnLockAccount(selectedUserId)}
              >
                Mở khóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
