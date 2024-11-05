import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../../AppProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function SideProjects() {
  const { sessionToken } = useAppContext();
  const [friends, setFriends] = useState([]);
  const [numFriends, setNumFriends] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreatePostClick = () => {
    navigate("/user/create-post");
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/friendlist/",
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

    fetchFriends();
  }, [sessionToken]);

  if (loading) return <div className="text-white">Đang tải...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-[20rem]">
      <h2 className="text-lg mb-4">Danh sách bạn bè ({numFriends})</h2>
      <div className="grid grid-cols-1 gap-4">
        {friends.map((friend) => (
          <div
            key={friend.user_id}
            className="p-4 rounded-lg flex items-center bg-[#FBBF24] text-black font-bold"
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
