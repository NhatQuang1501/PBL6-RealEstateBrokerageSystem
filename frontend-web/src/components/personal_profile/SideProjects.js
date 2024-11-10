import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../../AppProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function SideProjects() {
  const { id, sessionToken } = useAppContext();
  const [friends, setFriends] = useState([]);
  const [numFriends, setNumFriends] = useState(0);
  const [receives, setReceives] = useState([]);
  const [numReceives, setNumReceives] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();

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
          (request) => request.friendrequest_status === "đã từ chối"
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

    fetchReceives();
    fetchFriends();
  }, [sessionToken, id, userId]);

  // Accept friend request
  const handleAcceptFriendRequest = (senderId) => async () => {
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

      setReceives((prevReceives) =>
        prevReceives.filter(
          (receive) => receive.sender_profile.user_id !== senderId
        )
      );
      setNumReceives((prevNumReceives) => prevNumReceives - 1);
    } catch (err) {
      console.error("Error accepting friend request:", err);
      setError("Không thể chấp nhận yêu cầu kết bạn.");
    }
  };

  if (loading) return <div className="text-white">Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

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
                className="w-10 h-10 rounded-full mr-4 object-contain bg-slate-200 border-[1px] border-[#3CA9F9] border-solid"
              />
              <p>{friend.user.username}</p>
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
                  className="p-4 rounded-lg flex items-center bg-[#FBBF24] text-black font-bold"
                >
                  <img
                    src={
                      "http://127.0.0.1:8000/" + receive.sender_profile.avatar
                    }
                    alt={`${receive.sender_profile.user.username} avatar`}
                    className="w-10 h-10 rounded-full mr-4 object-contain bg-slate-200 border-[1px] border-[#3CA9F9] border-solid"
                  />
                  <p>{receive.sender_profile.user.username}</p>
                  <button
                    className="ml-auto bg-[#3CA9F9] text-white p-2 rounded-lg"
                    onClick={handleAcceptFriendRequest(
                      receive.friendrequest_id
                    )}
                  >
                    Chấp nhận
                  </button>
                </div>
              ))}
            </div>

            {/* Lời mời đã gửi */}
            <h2 className="text-lg mt-6 mb-4">Lời mời đã gửi</h2>
            <div className="grid grid-cols-1 gap-4">
              {receives.map((receive) => (
                <div
                  key={receive.friendrequest_id}
                  className="p-4 rounded-lg flex items-center bg-[#FBBF24] text-black font-bold"
                >
                  <img
                    src={
                      "http://127.0.0.1:8000/" + receive.sender_profile.avatar
                    }
                    alt={`${receive.sender_profile.user.username} avatar`}
                    className="w-10 h-10 rounded-full mr-4 object-contain bg-slate-200 border-[1px] border-[#3CA9F9] border-solid"
                  />
                  <p>{receive.sender_profile.user.username}</p>
                  <button
                    className="ml-auto bg-[#3CA9F9] text-white p-2 rounded-lg"
                    onClick={handleAcceptFriendRequest(
                      receive.friendrequest_id
                    )}
                  >
                    Chấp nhận
                  </button>
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
