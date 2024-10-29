import Panel from "../../components/panel/Panel";
import Post from "../../components/item_post/Post";
import Pagination from "../../components/pagination/pagination";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../../AppProvider";

const MainPageUser = () => {
  

  const [posts, setPost] = useState([]);
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = `http://127.0.0.1:8000/api/posts/`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Post data:", data);

        setPost(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [sessionToken]);

  return (
    <div className="font-montserrat main-content">
      <h3 className="text-2xl font-bold text-[#3CA9F9] flex items-center gap-2 pl-5 w-[30rem] shadow-lg shadow-[#E4FFFC] rounded-[3rem] mb-3">
        <FontAwesomeIcon
          icon={faListAlt}
          className="text-white bg-[#3CA9F9] p-3 w-5 h-5 rounded-full"
        />
        Danh sách bài đăng
      </h3>

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
    </div>
  );
};

export default MainPageUser;
