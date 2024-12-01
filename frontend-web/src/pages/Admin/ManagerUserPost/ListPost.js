import React, { useState, useEffect } from "react";
import Pagination from "../../../components/pagination/pagination";
import axios from "axios";
import { useAppContext } from "../../../AppProvider";
import { useNavigate } from "react-router-dom";
import Panel from "../../../components/panel/Panel";
import Post from "../../../components/item_post/Post";

const ListPosts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const currentPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const { role, sessionToken } = useAppContext();
  let navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/posts/", {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });

        console.log("Fetched posts:", response.data);

        if (Array.isArray(response.data)) {
          const approvedPosts = response.data.filter(
            (post) => post.status === "Đã duyệt"
          );
          setPosts(approvedPosts);
        } else if (response.data && Array.isArray(response.data.results)) {
          const approvedPosts = response.data.results.filter(
            (post) => post.status === "Đã duyệt"
          );
          setPosts(approvedPosts);
        } else {
          console.error("Unexpected data format:", response.data);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    if (sessionToken) {
      fetchPosts();
    }
  }, [sessionToken]);

  if (role !== "admin") {
    return (
      <div className="text-center text-red-500">
        Bạn không có quyền truy cập trang này.
      </div>
    );
  }

  const handleDetailClick = (postId) => {
    if (!sessionToken) {
      alert("Bạn cần đăng nhập để thực hiện hành động này.");
      return;
    } else {
      navigate(`/user/detail-post/${postId}`);
    }
  };

  return (
    <div className="rounded-lg h-[39rem] overflow-auto">
      <Panel className="flex flex-col h-full" type="personal-page">
        <div className="relative h-full overflow-y-auto grid grid-cols-1 gap-4">
          {currentPosts.map((post, index) => (
            <div
              key={index}
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white"
            >
              <Post post={post} type="personal-page" />
            </div>
          ))}
        </div>

        {posts.length > 0 ? (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        ) : (
          <div className="text-center text-gray-600 font-bold">
            Không có bài đăng nào
          </div>
        )}
      </Panel>
    </div>
  );
};

export default ListPosts;
