import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../../AppProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faUserPlus,
  faUser,
  faComment,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

export default function SideProjects() {
  const { id, sessionToken } = useAppContext();
  const [friends, setFriends] = useState([]);
  const [numFriends, setNumFriends] = useState(0);
  const [receives, setReceives] = useState([]);
  const [numReceives, setNumReceives] = useState(0);
  const [senders, setSenders] = useState([]);
  const [numSenders, setNumSenders] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();
  const menuRef = useRef(null);

  const [tooltip, setTooltip] = useState({
    visible: false,
    text: "",
    x: 0,
    y: 0,
  });

  const handleCreatePostClick = () => {
    navigate("/user/create-post");
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        let author = userId;
        if (userId === undefined) {
          author = id;
        }
        const response = await axios.get(
          `http://127.0.0.1:8000/api/friendlist/${author}/`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );

        setFriends(response.data.friends);
        setNumFriends(response.data.count);
        console.log("Friends data:", response.data.friends);
      } catch (err) {
        console.error("Error fetching friends:", err);
        setError("Không thể tải danh sách bạn bè.");
      } finally {
        setLoading(false);
      }
    };

    // Yêu cầu kết bạn - receiver
    const fetchReceives = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/friend-requests-received/`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );

        // Lọc các lời mời kết bạn có friendrequest_status là "đã từ chối"
        const filteredReceives = response.data.data.filter(
          (request) => request.friendrequest_status === "đang chờ"
        );

        setReceives(filteredReceives);
        setNumReceives(filteredReceives.length);
        console.log("Receive data:", filteredReceives.length);
      } catch (err) {
        console.error("Error fetching receive:", err);
        setError("Không thể tải danh sách yêu cầu kết bạn.");
      } finally {
        setLoading(false);
      }
    };

    // Yêu cầu kết bạn - sender
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

        setSenders(filteredSenders);
        setNumSenders(filteredSenders.length);
        console.log("Sender data:", filteredSenders.length);
      } catch (err) {
        console.error("Error fetching sender:", err);
        setError("Không thể tải danh sách yêu cầu kết bạn.");
      } finally {
        setLoading(false);
      }
    };

    // Đóng Menu khi con trỏ chuột trỏ ra ngoài
    const handleMouseDowwn = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    fetchReceives();
    fetchSenders();
    fetchFriends();
    document.addEventListener("mousedown", handleMouseDowwn);
    return () => {
      document.removeEventListener("mousedown", handleMouseDowwn);
    };
  }, [sessionToken, id, userId]);

  // Accept friend request
  const handleAcceptFriendRequest = async (senderId) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/friend-requests/`,
        {
          friendrequest_id: senderId,
          friendrequest_status: "đã kết bạn",
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );
      console.log("Accept friend request:", senderId);

      setReceives((prevReceives) =>
        prevReceives.filter(
          (receive) => receive.sender_profile.user_id !== senderId
        )
      );
      setNumReceives((prevNumReceives) => prevNumReceives - 1);
      window.location.reload();
    } catch (err) {
      console.error("Error accepting friend request:", err);
      setError("Không thể chấp nhận yêu cầu kết bạn.");
    }
  };

  // Decline friend request
  const handleDeclineFriendRequest = async (senderId) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/friend-requests/`,
        {
          friendrequest_id: senderId,
          friendrequest_status: "đã từ chối",
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      setReceives((prevReceives) =>
        prevReceives.filter(
          (receive) => receive.sender_profile.user_id !== senderId
        )
      );
      setNumReceives((prevNumReceives) => prevNumReceives - 1);
      window.location.reload();
    } catch (err) {
      console.error("Error declining friend request:", err);
      setError("Không thể từ chối yêu cầu kết bạn.");
    }
  };

  // Unfriend
  const handleUnfriend = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/unfriend/`, {
        data: {
          friend_user_id: selectedFriendId,
        },
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.user_id !== selectedFriendId)
      );
      setNumFriends((prevNumFriends) => prevNumFriends - 1);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error unfriending:", err);
      setError("Không thể hủy kết bạn.");
    }
  };

  // Delete sender
  const handleDeleteSender = (senderId) => async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/friend-requests/${senderId}/`,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      setSenders((prevSenders) =>
        prevSenders.filter((sender) => sender.friendrequest_id !== senderId)
      );
      setNumSenders((prevNumSenders) => prevNumSenders - 1);
    } catch (err) {
      console.error("Error deleting sender:", err);
      setError("Không thể xóa lời mời.");
    }
  };

  const openModal = (friendId) => {
    setSelectedFriendId(friendId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFriendId(null);
  };

  if (loading) return <div className="text-white">Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const showTooltip = (text, event) => {
    setTooltip({
      visible: true,
      text: text,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, text: "", x: 0, y: 0 });
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handlePersonalProfileClick = (user_id) => {
    navigate(`/user/profile/${user_id}`);
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg w-[20rem]">
      <div>
        {/* FriendList */}
        <h2 className="text-lg mb-4 font-bold">
          Danh sách bạn bè ({numFriends})
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {friends.map((friend) => (
            <div
              key={friend.user_id}
              className="p-4 rounded-lg flex items-center bg-white text-black font-bold"
            >
              <img
                src={"http://127.0.0.1:8000/" + friend.user.avatar}
                alt={`${friend.user.username} avatar`}
                className="w-10 h-10 rounded-full mr-4 object-contain bg-slate-200 border-[1px] border-[#3CA9F9] border-solid cursor-pointer"
                onClick={toggleMenu}
              />
              <p
                className="flex-1 truncate"
                onMouseEnter={(e) => showTooltip(friend.user.username, e)}
                onMouseLeave={hideTooltip}
              >
                {friend.user.username}
              </p>
              {!userId || userId === id ? (
                <button
                  className="ml-auto bg-gradient-to-r from-red-400 to-red-600 text-white p-2 rounded-lg shadow-lg hover:shadow-xl hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => openModal(friend.user_id)}
                >
                  Hủy kết bạn
                </button>
              ) : null}

              {tooltip.visible && (
                <div
                  className="fixed bg-black text-white p-2 rounded-lg"
                  style={{ top: tooltip.y + 20, left: tooltip.x }}
                >
                  {tooltip.text}
                </div>
              )}

              {isOpen && (
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
                    <FontAwesomeIcon
                      icon={faComment}
                      className="text-green-500"
                    />
                    <span className="text-gray-700">
                      Nhắn tin với người này
                    </span>
                  </button>
                  <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md">
                    <FontAwesomeIcon icon={faFlag} className="text-red-500" />
                    <span className="text-gray-700">Báo cáo</span>
                  </button>
                </div>
              )}

              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
                  <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-lg font-semibold mb-4">
                      Bạn có chắc chắn muốn hủy kết bạn?
                    </h2>
                    <div className="flex justify-center gap-4">
                      <button
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                        onClick={handleUnfriend}
                      >
                        Hủy kết bạn
                      </button>
                      <button
                        className="bg-gray-300 text-black p-2 rounded-lg hover:bg-gray-400"
                        onClick={closeModal}
                      >
                        Hủy bỏ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!userId || userId === id ? (
          <>
            {/* Receive */}
            <h2 className="text-lg mt-6 mb-4">
              Yêu cầu kết bạn ({numReceives})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {receives.map((receive) => (
                <div
                  key={receive.friendrequest_id}
                  className="p-4 rounded-lg flex flex-col bg-[#FBBF24] text-black font-bold"
                >
                  <div className="flex items-center">
                    <img
                      src={
                        "http://127.0.0.1:8000/" + receive.sender_profile.avatar
                      }
                      alt={`${receive.sender_profile.user.username} avatar`}
                      className="w-10 h-10 rounded-full mr-4 object-contain bg-slate-200 border-[1px] border-[#3CA9F9] border-solid"
                    />
                    <p>{receive.sender_profile.user.username}</p>
                    <FontAwesomeIcon icon={faUserPlus} className="ml-5" />
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-2 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-400 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
                      onClick={() =>
                        handleAcceptFriendRequest(receive.friendrequest_id)
                      }
                    >
                      Chấp nhận
                    </button>
                    <button
                      className="bg-gradient-to-r from-red-400 to-red-600 text-white p-2 rounded-lg shadow-lg hover:shadow-xl hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                      onClick={() =>
                        handleDeclineFriendRequest(receive.friendrequest_id)
                      }
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Lời mời đã gửi */}
            <h2 className="text-lg mt-6 mb-4">Lời mời đã gửi ({numSenders})</h2>
            <div className="grid grid-cols-1 gap-4">
              {senders.map((sender) => (
                <div
                  key={sender.friendrequest_id}
                  className="p-4 rounded-lg flex items-center bg-[#FBBF24] text-black font-bold"
                >
                  <img
                    src={
                      "http://127.0.0.1:8000/" + sender.receiver_profile.avatar
                    }
                    alt={`${sender.receiver_profile.user.username} avatar`}
                    className="w-10 h-10 rounded-full mr-4 object-contain bg-slate-200 border-[1px] border-[#3CA9F9] border-solid"
                  />
                  <p
                    className="flex-1 truncate"
                    onMouseEnter={(e) =>
                      showTooltip(sender.receiver_profile.user.username, e)
                    }
                    onMouseLeave={hideTooltip}
                  >
                    {sender.receiver_profile.user.username}
                  </p>
                  <button
                    className="ml-auto bg-gradient-to-r from-red-400 to-red-600 text-white p-2 rounded-lg shadow-lg hover:shadow-xl hover:from-red-500 hover:to-red-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                    onClick={handleDeleteSender(sender.friendrequest_id)}
                  >
                    Xóa lời mời
                  </button>
                  {tooltip.visible && (
                    <div
                      className="fixed bg-black text-white p-2 rounded-lg"
                      style={{ top: tooltip.y + 20, left: tooltip.x }}
                    >
                      {tooltip.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Fixed Contact Icon */}
      <div
        onClick={handleCreatePostClick}
        className="fixed bottom-4 right-4 bg-[#3CA9F9] text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-[#005bb5] transition duration-300 cursor-pointer"
        style={{ zIndex: 1000 }}
        title="Tạo bài đăng"
      >
        <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
      </div>
    </div>
  );
}
