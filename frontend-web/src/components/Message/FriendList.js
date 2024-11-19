import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faFlag,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";

export default function FriendList({ selectFriend }) {
  const { id, sessionToken } = useAppContext();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [openMenuUserId, setOpenMenuUserId] = useState(null);

  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });
  const menuRef = useRef(null);

  useEffect(() => {
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
        setFriends(response.data.friends);
        console.log("Friends data:", response.data.friends);
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError("Không thể tải danh sách bạn bè.");
      } finally {
        setLoading(false);
      }
    };

    // Infor
    const handleMouseDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuUserId(null);
      }
    };
    fetchFriends();
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [id, sessionToken]);

  const showTooltip = (text, event) => {
    setTooltip({
      visible: true,
      text,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, text: "", x: 0, y: 0 });
  };

  const toggleMenu = (user_id) => {
    setOpenMenuUserId((prevUserId) =>
      prevUserId === user_id ? null : user_id
    );
  };

  const handlePersonalProfileClick = (user_id) => {
    navigate(`/user/profile/${user_id}`);
  };

  if (loading) {
    return <p className="text-white">Đang tải danh sách bạn bè...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg w-[25rem] h-[38rem] overflow-y-auto border-solid border-gray-300 border-[1px]">
      <h2 className="text-lg mb-4 font-bold text-center text-blue-600 border-solid border-gray-300 border-b-[2px] pb-2">
        Danh sách bạn bè ({friends.length})
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {friends.map((friend) => (
          <div
            key={friend.user_id}
            className="p-4 rounded-lg flex items-center bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] text-black font-bold relative shadow-md"
          >
            {/* Avatar */}
            <img
              src={"http://127.0.0.1:8000" + friend.user.avatar}
              alt={`${friend.user.username} avatar`}
              className="w-10 h-10 rounded-full mr-4 object-contain bg-slate-200 border-[1px] border-[#3CA9F9] border-solid cursor-pointer"
              onClick={() => toggleMenu(friend.user_id)}
            />
            {/* Username */}
            <p
              className="flex-1 truncate"
              onMouseEnter={(e) => showTooltip(friend.user.username, e)}
              onMouseLeave={hideTooltip}
            >
              {friend.user.username}
            </p>

            <button
              className="ml-auto bg-gradient-to-r from-blue-400 to-blue-600 text-white p-2 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
              onClick={() =>
                selectFriend(
                  friend.chatroom_id,
                  friend.user.avatar,
                  friend.user.username,
                  friend.user_id
                )
              }
            >
              <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
              Nhắn tin
            </button>

            {/* Tooltip */}
            {tooltip.visible && (
              <div
                className="fixed bg-black text-white p-2 rounded-lg"
                style={{ top: tooltip.y + 20, left: tooltip.x }}
              >
                {tooltip.text}
              </div>
            )}

            {openMenuUserId === friend.user_id && (
              <div
                ref={menuRef}
                className="absolute left-5 bottom-3 mt-2 w-auto p-2 bg-white border-solid border-[1px] border-gray-300 rounded-lg shadow-lg flex flex-col space-y-2 z-50"
              >
                <button
                  className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
                  onClick={() => {
                    handlePersonalProfileClick(friend.user_id);
                  }}
                >
                  <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                  <span className="text-gray-700">Thông tin cá nhân</span>
                </button>
                <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md">
                  <FontAwesomeIcon icon={faFlag} className="text-red-500" />
                  <span className="text-gray-700">Báo cáo</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
