import Panel from "../../components/panel/Panel";
import Post from "../../components/item_post/Post";
import { useState } from "react";

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

  
  return (
    <>
      <Panel className="flex flex-col max-h-full">
        <div className="relative max-h-[38rem] overflow-y-auto grid grid-cols-1 gap-4">
          {/* {currentPosts.map((post, index) => (
            <div
              key={index}
              className="border-[3px] rounded-[1rem] border-[#002182] shadow-md bg-white"
            >
              <Post />
            </div>
          ))} */}
          <Post />
        </div>
      </Panel>
    </>
  );
};

export default MainPageUser;
