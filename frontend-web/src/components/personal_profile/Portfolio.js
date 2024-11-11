import { useParams } from "react-router-dom";
import { useAppContext } from "../../AppProvider";
import Post from "../../components/item_post/Post";
import Pagination from "../../components/pagination/pagination";
import Panel from "../../components/panel/Panel";
import { useEffect, useState } from "react";

export default function Portfolio() {
  const { sessionToken, id } = useAppContext();
  const { userId } = useParams();

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState(
    localStorage.getItem("filterStatus") || "Đã duyệt"
  );
  const itemsPerPage = 10;

  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const currentPosts = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    localStorage.setItem("filterStatus", status);
    setCurrentPage(1);
    window.location.reload();
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let author = userId;
        if (userId === undefined) {
          author = id;
        }

        // const url =
        //   filterStatus === "Đã duyệt"
        //     ? `http://127.0.0.1:8000/api/posts/${author}/`
        //     : `http://127.0.0.1:8000/api/pending-posts/${id}/`;
        let url;
        if (filterStatus === "Đã duyệt") {
          url = `http://127.0.0.1:8000/api/posts/${author}/`;
        }
        if (filterStatus === "Đang chờ duyệt" && id === author) {
          url = `http://127.0.0.1:8000/api/pending-posts/${id}/`;
        }
        if (filterStatus === "Đã lưu") {
          if (author !== "") {
            url = `http://127.0.0.1:8000/api/saved-posts/${author}/`;
          } else {
            url = `http://127.0.0.1:8000/api/saved-posts/${id}/`;
          }
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Post data:", data);

        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [sessionToken, id, filterStatus, userId]);

  return (
    <div className="bg-gradient-to-r from-[#fafffe] via-[#e0f7fa] to-[#b2ebf2] p-6 rounded-lg">
      <div className="flex flex-row justify-between gap-10">
        <h2 className="text-lg font-bold mb-4">
          <button
            className={`text-black ${
              filterStatus === "Đã duyệt" ? "underline text-blue-500" : ""
            }`}
            onClick={() => handleFilterChange("Đã duyệt")}
          >
            Bài đăng đã duyệt
          </button>
        </h2>
        <h2 className="text-lg font-bold mb-4">
          <button
            className={`text-black ${
              filterStatus === "Đang chờ duyệt" ? "underline text-blue-500" : ""
            }`}
            onClick={() => handleFilterChange("Đang chờ duyệt")}
          >
            Bài đăng chờ duyệt
          </button>
        </h2>
        <h2 className="text-lg font-bold mb-4">
          <button
            className={`text-black ${
              filterStatus === "Đã lưu" ? "underline text-blue-500" : ""
            }`}
            onClick={() => handleFilterChange("Đã lưu")}
          >
            Bài đăng đã lưu
          </button>
        </h2>
      </div>

      <Panel className="flex flex-col max-h-full" type="personal-page">
        <div className="relative h-full overflow-y-auto grid grid-cols-1 gap-4">
          {currentPosts.map((post, index) => (
            <div
              key={index}
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white p-4"
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
}
