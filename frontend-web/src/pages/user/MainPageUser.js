import Panel from "../../components/panel/Panel";
import Post from "../../components/item_post/Post";
import Pagination from "../../components/pagination/pagination";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../../AppProvider";
import { useNavigate } from "react-router-dom";

const MainPageUser = ({ searchValue }) => {
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

  const { sessionToken } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = searchValue
          ? `http://127.0.0.1:8000/api/search/?text=${encodeURIComponent(
              searchValue
            )}`
          : "http://127.0.0.1:8000/api/posts/";

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Post data:", data);

        const sortedPosts = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          : [];
        setPosts(sortedPosts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [searchValue]);

  const handleCreatePostClick = () => {
    if (!sessionToken) {
      navigate("authen/login");
      return;
    } else {
      navigate("/user/create-post");
    }
  };

  return (
    <div className="font-montserrat main-content">
      <div className="flex items-center justify-between w-[72%]">
        {!searchValue && (
          <h3 className="text-2xl font-bold text-[#3CA9F9] flex items-center gap-2 pl-5 w-[30rem]  rounded-[3rem] mb-3">
            <FontAwesomeIcon
              icon={faListAlt}
              className="text-white bg-[#3CA9F9] p-3 w-5 h-5 rounded-full"
            />
            Danh sách bài đăng
          </h3>
        )}{" "}
        {searchValue && (
          <h3 className="text-2xl font-bold text-[#3CA9F9] flex items-center gap-2 pl-5 w-[30rem]  rounded-[3rem] mb-3">
            <FontAwesomeIcon
              icon={faListAlt}
              className="text-white bg-[#3CA9F9] p-3 w-5 h-5 rounded-full"
            />
            Đã tìm kiếm theo "{searchValue}"
          </h3>
        )}
        <a className="underline text-blue-700" href="#!">
          Nhiều hơn thế
        </a>
      </div>

      <Panel className="flex flex-col max-h-full">
        <div className="relative h-full overflow-y-auto grid grid-cols-1 gap-4">
          {currentPosts.map((post, index) => (
            <div
              key={index}
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white"
            >
              <Post post={post} />
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
          <div className="text-center font-bold">Không có bài đăng nào</div>
        )}
      </Panel>
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
};

export default MainPageUser;
