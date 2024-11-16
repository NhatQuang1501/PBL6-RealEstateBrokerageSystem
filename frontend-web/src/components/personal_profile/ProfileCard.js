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
  faUserPlus,
  faCommentDots,
  faUserEdit,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { FaAddressCard, FaUserFriends } from "react-icons/fa";

const ProfileCard = () => {
  const navigate = useNavigate();
  const { id, sessionToken } = useAppContext();
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null); // Updated here
  const [fileName, setFileName] = useState("Hãy chọn file ảnh");
  const [avatar, setAvatar] = useState(null);
  const { userId } = useParams();
  const [isFriend, setIsFriend] = useState(false);
  const [senders, setSenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSend, setIsSend] = useState(false);

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

    // Check if the user is a friend
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/friendlist/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );

        const friends = response.data.friends;
        console.log("Friends data-----:", friends);
        const friendIds = friends.map((friend) => friend.user_id);
        console.log("Friend IDs------:", friendIds);
        setIsFriend(friendIds.includes(userId));
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();

    const fetchSenders = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/friend-requests-sent/`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );

        // Lọc các yêu cầu kết bạn có friendrequest_status là "đang chờ"
        const filteredSenders = response.data.data.filter(
          (request) => request.friendrequest_status === "đang chờ"
        );
        // Kiểm tra đã gửi yêu cầu kết bạn chưa
        const senders = filteredSenders.map((sender) => sender.receiver);
        setIsSend(senders.includes(userId));
        console.log("Sender data=============>:", filteredSenders.length);
        setSenders(filteredSenders);
        console.log("Sender data:", filteredSenders.length);
      } catch (err) {
        console.error("Error fetching sender:", err);
        setError("Không thể tải danh sách yêu cầu kết bạn.");
      } finally {
        setLoading(false);
      }
    };

    fetchSenders();
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

  // Send friend request
  const handleSendFriendRequest = (username) => async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/friend-requests/`,
        {
          receiver: username,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      console.log("Friend request sent successfully:", response.data);
      alert("Yêu cầu kết bạn đã được gửi !");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Gửi yêu cầu kết bạn thất bại !");
    }
  };


  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg">
      {/* Profile Image */}
      <div className="mb-4 flex flex-col justify-center">
        <div className="grid justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt="profile"
              className="rounded-full w-[12rem] h-[12rem] object-contain bg-gray-300 border-[3px] border-[#b2ebf2] border-solid shadow-lg"
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
                className="p-1 text-sm bg-white font-bold text-blue-600 rounded-lg mt-2 pr-2 hover:shadow-lg hover:bg-blue-200 flex items-center gap-2"
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
          ) : isFriend ? (
            // Trường hợp bạn bè
            <div className="flex flex-row justify-center items-center bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2]  rounded-lg mt-2 hover:shadow-lg hover:bg-blue-200 p-1">
              <div className="text-sm font-bold text-blue-600">Bạn bè</div>
              <FaUserFriends className="text-2xl text-blue-600 ml-2" />
            </div>
          ) : (
            // Trường hợp người lạ
            <>
            {isSend ? (              <button
                className="p-1 text-sm bg-white font-bold text-blue-600 rounded-lg mt-2 hover:shadow-lg hover:bg-blue-200"
                onClick={handleSendFriendRequest(user.user.username)}
              >
                Kết bạn
                <FontAwesomeIcon icon={faUserPlus} className="ml-2" />
              </button>
            ) : (
              <div className="flex flex-row justify-center items-center bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2]  rounded-lg mt-2 hover:shadow-lg hover:bg-blue-200 p-1">
                <div className="text-sm font-bold text-blue-600">Đã gửi yêu cầu</div>
              </div>
            )}
            </>
          )}
        </div>
      </div>
      {!userId || userId === id ? (
        <>
          {/* Contact Button */}
          <button
            className="bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] text-black font-bold px-4 py-2 rounded-lg w-full mb-4 shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-600 hover:text-white border-[1px] border-white border-solid transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2"
            onClick={() => handleUpdateProfile()}
          >
            <FontAwesomeIcon icon={faUserEdit} /> {/* Thêm biểu tượng */}
            Cập nhật trang cá nhân
          </button>
        </>
      ) : isFriend ? (
        // Trường hợp bạn bè
        <>
          {/* Contact Button */}
          <button
            className="bg-gradient-to-r from-purple-300 to-purple-400 text-black font-bold px-4 py-2 rounded-lg w-full mb-4 shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 border-[1px] border-solid border-white"
            // onClick={() => handleUpdateProfile()}
          >
            <FontAwesomeIcon icon={faCommentDots} />
            Nhắn tin
          </button>
        </>
      ) : (
        <>
          {/* Contact Button */}
          {/* <button
            className="bg-blue-500 px-4 py-2 rounded-lg w-full mb-4"
            // onClick={() => handleUpdateProfile()}
          >
            Nhắn tin
          </button> */}
        </>
      )}

      {/* Face Customizer Options */}
      <div className="p-5 bg-[#fafffe] rounded-lg shadow-md">
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
            <FaAddressCard className="text-blue-500 mr-2" />
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
