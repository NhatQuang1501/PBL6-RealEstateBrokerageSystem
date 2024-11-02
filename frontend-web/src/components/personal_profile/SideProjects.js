// components/SideProjects.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../../AppProvider";

export default function SideProjects() {
  const { sessionToken } = useAppContext();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <h2 className="text-lg mb-4">Danh sách bạn bè</h2>
      <div className="grid grid-cols-1 gap-4">
        {friends.map((friend, index) => (
          <div
            key={index}
            className="p-4 rounded-lg flex justify-center items-center bg-[#FBBF24] text-black font-bold"
          >
            <p>{friend}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
