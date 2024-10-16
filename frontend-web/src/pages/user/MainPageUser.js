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
    <div>
      <hr className=" w-[20%] my-[20px] mx-auto border-solid border-2 border-indigo-600"></hr>
      <h3 className="text-center font-semibold text-[20px]">Danh sách bài đăng</h3>
    </div>
      <Panel className="flex flex-col max-h-full">
        <div className=" max-h-[38rem] overflow-y-auto grid grid-cols-1 gap-4 ">
          
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
