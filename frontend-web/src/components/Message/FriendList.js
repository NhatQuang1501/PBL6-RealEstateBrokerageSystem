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
import User from "../../assets/image/User.webp";

export default function FriendList({ selectFriend }) {
  const { id, sessionToken } = useAppContext();
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
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
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/negotiation-chatrooms/?user_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
        console.log("============negolist=======>", response.data.data);
        // Separate buyers and sellers based on author
        const buyers = response.data.data
          .filter((chatroom) => chatroom.author === id)
          .flatMap((chatroom) => chatroom.other_participant);

        const sellers = response.data.data
          .filter((chatroom) => chatroom.author !== id)
          .flatMap((chatroom) => chatroom.other_participant);

        setBuyers(buyers);
        setSellers(sellers);
        console.log("buyers data:", buyers);
        console.log("sellers data:", sellers);
      } catch (err) {
        console.error("Error fetching users:", err);
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
    fetchUsers();
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
    return (
      <p className="text-white">Đang tải danh sách người thương lượng...</p>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col w-[38rem] gap-5 overflow-y-auto">
      <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg h-[50rem] overflow-y-auto border-solid border-gray-300 border-[1px]">
        <h2 className="text-lg mb-4 font-bold text-center text-blue-600 border-solid border-gray-300 border-b-[2px] pb-2">
          Danh sách người mua ({buyers.length})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {buyers.map((friend) => {
            // Ensure other_participant exists and has at least one member
            const participant =
              friend.other_participant && friend.other_participant[0];

            if (!participant) {
              // Handle cases where other_participant is undefined or empty
              return null;
            }

            return (
              <div
                key={friend.chatroom_id}
                className="p-4 rounded-lg flex items-center bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] text-black font-semibold relative shadow-md"
              >
                {/* Avatar */}
                {/* <img
                  src={
                    participant.avatar
                      ? `http://127.0.0.1:8000${participant.avatar}`
                      : User
                  }
                  alt={`${participant.username} avatar`}
                  className="w-12 h-12 rounded-full mr-4 object-cover bg-slate-200 border-[1px] border-[#3CA9F9] cursor-pointer"
                  onClick={() => toggleMenu(participant.user_id)}
                /> */}

                {/* Username */}
                <p
                  className="flex-1 truncate"
                  onMouseEnter={(e) => showTooltip(participant.username, e)}
                  onMouseLeave={hideTooltip}
                >
                  {participant.username}
                </p>

                {/* Chat Button */}
                <button
                  className="ml-auto bg-gradient-to-r from-blue-400 to-blue-600 text-white p-2 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
                  onClick={() =>
                    selectFriend(
                      friend.chatroom_id,
                      participant.avatar,
                      participant.username,
                      participant.user_id
                    )
                  }
                >
                  <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                  Nhắn tin
                </button>

                {/* Tooltip */}
                {tooltip.visible && tooltip.userId === participant.user_id && (
                  <div
                    className="absolute bg-black text-white p-2 rounded-lg"
                    style={{ top: tooltip.y + 20, left: tooltip.x }}
                  >
                    {tooltip.text}
                  </div>
                )}

                {/* Context Menu */}
                {openMenuUserId === participant.user_id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col space-y-2 z-50"
                  >
                    <button
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
                      onClick={() => {
                        handlePersonalProfileClick(participant.user_id);
                        setOpenMenuUserId(null);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-blue-500"
                      />
                      <span className="text-gray-700">Thông tin cá nhân</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
                      onClick={() => {
                        // handleReportUser(participant.user_id);
                        setOpenMenuUserId(null);
                      }}
                    >
                      <FontAwesomeIcon icon={faFlag} className="text-red-500" />
                      <span className="text-gray-700">Báo cáo</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gray-100 text-black p-6 rounded-lg shadow-lg h-[50rem] overflow-y-auto border-solid border-gray-300 border-[1px]">
        <h2 className="text-lg mb-4 font-bold text-center text-blue-600 border-solid border-gray-300 border-b-[2px] pb-2">
          Danh sách người bán ({sellers.length})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {sellers.map((friend) => {
            // Ensure other_participant exists and has at least one member
            const participant =
              friend.other_participant && friend.other_participant[0];

            if (!participant) {
              // Handle cases where other_participant is undefined or empty
              return null;
            }

            return (
              <div
                key={friend.chatroom_id}
                className="p-4 rounded-lg flex items-center bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] text-black font-semibold relative shadow-md"
              >
                {/* Avatar */}
                {/* <img
                  src={
                    participant.avatar
                      ? `http://127.0.0.1:8000${participant.avatar}`
                      : User
                  }
                  alt={`${participant.username} avatar`}
                  className="w-12 h-12 rounded-full mr-4 object-cover bg-slate-200 border-[1px] border-[#3CA9F9] cursor-pointer"
                  onClick={() => toggleMenu(participant.user_id)}
                /> */}

                {/* Username */}
                <p
                  className="flex-1 truncate"
                  onMouseEnter={(e) => showTooltip(participant.username, e)}
                  onMouseLeave={hideTooltip}
                >
                  {participant.username}
                </p>

                {/* Chat Button */}
                <button
                  className="ml-auto bg-gradient-to-r from-blue-400 to-blue-600 text-white p-2 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
                  onClick={() =>
                    selectFriend(
                      friend.chatroom_id,
                      participant.avatar,
                      participant.username,
                      participant.user_id
                    )
                  }
                >
                  <FontAwesomeIcon icon={faCommentDots} className="mr-2" />
                  Nhắn tin
                </button>

                {/* Tooltip */}
                {tooltip.visible && tooltip.userId === participant.user_id && (
                  <div
                    className="absolute bg-black text-white p-2 rounded-lg"
                    style={{ top: tooltip.y + 20, left: tooltip.x }}
                  >
                    {tooltip.text}
                  </div>
                )}

                {/* Context Menu */}
                {openMenuUserId === participant.user_id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-48 p-2 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col space-y-2 z-50"
                  >
                    <button
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
                      onClick={() => {
                        handlePersonalProfileClick(participant.user_id);
                        setOpenMenuUserId(null);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-blue-500"
                      />
                      <span className="text-gray-700">Thông tin cá nhân</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
                      onClick={() => {
                        // handleReportUser(participant.user_id);
                        setOpenMenuUserId(null);
                      }}
                    >
                      <FontAwesomeIcon icon={faFlag} className="text-red-500" />
                      <span className="text-gray-700">Báo cáo</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
