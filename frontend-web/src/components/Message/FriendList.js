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
import User from "../../assets/image/User.png";

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
          `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}/api/negotiation-chatrooms/?user_id=${id}`,
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
          .map((chatroom) => ({
            chatroom_id: chatroom.chatroom_id,
            post_id: chatroom.post_id,
            negotiation_id: chatroom.negotiation_id,
            ...chatroom.other_participant,
            type: "buyer",
          }));

        const sellers = response.data.data
          .filter((chatroom) => chatroom.author !== id)
          .map((chatroom) => ({
            chatroom_id: chatroom.chatroom_id,
            post_id: chatroom.post_id,
            negotiation_id: chatroom.negotiation_id,
            ...chatroom.other_participant,
            type: "seller",
          }));

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
    <div className="flex flex-col w-[30rem] gap-5 overflow-y-auto">
      {/* Danh sách người mua */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg h-[50rem] overflow-y-auto border-solid border-gray-300 border-[1px]">
        <h2 className=" mb-4 font-bold text-center text-black border-solid border-gray-300 border-b-[2px] pb-2">
          Danh sách người mua ({buyers.length})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {buyers.length === 0 && (
            <div className="p-2 pt-[6rem] text-center text-gray-500 font-semibold">
              Danh sách trống
            </div>
          )}
          {buyers.map((participant) => {
            if (!participant) {
              return null;
            }

            return (
              <div
                key={participant.chatroom_id}
                className="p-2 rounded-lg flex items-center bg-gray-200 text-black font-semibold relative shadow-md border-[1px] border-gray-300 border-solid"
              >
                {/* Avatar */}
                <img
                  src={
                    participant.avatar
                      ? `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}${participant.avatar}`
                      : User
                  }
                  alt={`${participant.username} avatar`}
                  className="w-10 h-10 rounded-full mr-4 object-cover bg-slate-200 border-[1px] border-[#3CA9F9] cursor-pointer"
                  onClick={() => toggleMenu(participant.user_id)}
                  data-userid={participant.user_id}
                  aria-label={`${participant.username}'s avatar`}
                />

                {/* Username */}
                <p
                  className="flex-1 truncate text-sm"
                  onMouseEnter={(e) => showTooltip(participant.username, e)}
                  onMouseLeave={hideTooltip}
                >
                  {participant.username}
                </p>

                {/* Chat Button */}
                <button
                  className="ml-auto bg-gradient-to-r from-blue-400 to-blue-500 text-white text-sm p-1 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
                  onClick={() =>
                    selectFriend(
                      participant.chatroom_id,
                      participant.post_id,
                      participant.negotiation_id,
                      participant.avatar,
                      participant.username,
                      participant.user_id,
                      participant.type
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

      {/* Danh sách người bán */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg h-[50rem] overflow-y-auto border-solid border-gray-300 border-[1px]">
        <h2 className="mb-4 font-bold text-center text-black border-solid border-gray-300 border-b-[2px] pb-2">
          Danh sách người bán ({sellers.length})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {sellers.length === 0 && (
            <div className="p-2 pt-[6rem] text-center text-gray-500 font-semibold">
              Danh sách trống
            </div>
          )}
          {sellers.map((participant) => {
            if (!participant) {
              return null;
            }

            return (
              <div
                key={participant.chatroom_id}
                className="p-2 rounded-lg flex items-center bg-gray-200 text-black font-semibold relative shadow-md border-[1px] border-gray-300 border-solid"
              >
                {/* Avatar */}
                <img
                  src={
                    participant.avatar
                      ? `${process.env.REACT_APP_SWEETHOME_API_ENDPOINT}${participant.avatar}`
                      : User
                  }
                  alt={`${participant.username} avatar`}
                  className="w-10 h-10 rounded-full mr-4 object-cover bg-slate-200 border-[1px] border-[#3CA9F9] cursor-pointer"
                  onClick={() => toggleMenu(participant.user_id)}
                  data-userid={participant.user_id}
                  aria-label={`${participant.username}'s avatar`}
                />

                {/* Username */}
                <p
                  className="flex-1 truncate text-sm"
                  onMouseEnter={(e) => showTooltip(participant.username, e)}
                  onMouseLeave={hideTooltip}
                >
                  {participant.username}
                </p>

                {/* Chat Button */}
                <button
                  className="ml-auto bg-gradient-to-r from-blue-400 to-blue-500 text-white text-sm p-1 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
                  onClick={() =>
                    selectFriend(
                      participant.chatroom_id,
                      participant.post_id,
                      participant.negotiation_id,
                      participant.avatar,
                      participant.username,
                      participant.user_id,
                      participant.type
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
