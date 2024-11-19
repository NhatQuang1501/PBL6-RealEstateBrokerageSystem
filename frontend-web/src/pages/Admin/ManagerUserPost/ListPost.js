import React, { useState, useEffect } from "react";
import Pagination from "../../Pagination/Pagination";
import axios from "axios";
import PostDetailPopup from "../DetailPost/PostDetailAdmin";
import { useAppContext } from "../../../AppProvider";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import Panel from "../../../components/panel/Panel";
import Post from "../../../components/item_post/Post";

const ListPosts = () => {
  // const [sortOption, setSortOption] = useState("Mới nhất");
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
  // const [selectedPostId, setSelectedPostId] = useState(null);
  const { role, sessionToken } = useAppContext();
  let navigate = useNavigate();

  // const openPopup = (postId) => {
  //   setSelectedPostId(postId);
  // };

  // const closePopup = () => {
  //   setSelectedPostId(null);
  // };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/posts/", {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });

        console.log("Dữ liệu trả về:", response.data);

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
          console.error("Dữ liệu không phải là một mảng:", response.data);
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
  <div className="rounded-lg h-[50rem]">
    <Panel className="flex flex-col " type="personal-page">
      <div className="relative h-screen overflow-y-auto grid grid-cols-1 gap-4">
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
