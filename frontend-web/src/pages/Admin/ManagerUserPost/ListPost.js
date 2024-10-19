import React, { useState, useEffect } from "react";
import Pagination from "../../Pagination/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShareAlt,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
const ListPosts = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10);

  useEffect(() => {
    fetch("/api/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.log(err));
  }, []);

  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accounts.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    setTimeout(() => {
      setIsClicked(!isClicked);
    }, 80);
  };
  return (
    <div className="container mx-auto p-6 bg-white h-full">
      <div className="flex flex-col w-[80%] h-[40%] bg-white border-solid border-2 border-slate-200 rounded-xl mb-5">
        <div className="flex justify-between items-center px-6 py-2 ">
          <h2 className="text-lg font-semibold text-[#3CA9F9]">
            Bán nhà ở tại 123 Tôn Đức Thắng
          </h2>
          <button className="px-5 py-2 text-[#3CA9F9] border border-[#3CA9F9] rounded-lg">
            Đang bán
          </button>
        </div>

        <div className="flex flex-row px-4 py-2">
          <div className="w-[40%] pr-4">
            <img
              className="w-full h-[60%] object-cover rounded-md"
              src="https://th.bing.com/th/id/OIP.c_e6N6YtIVI2NFhW_Ugm6wHaF7?w=246&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt="room_image"
            />
          </div>

          <div className="flex flex-col justify-between w-[55%] h-[55%] border-2 border-[#DCDCDC] p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-gray-700 text-lg font-bold">
              <p className="text-red-600">12 tỷ VND</p>
              <p className="text-red-600">1000m²</p>
            </div>

            <p className="text-gray-700">Hải Châu, Đà Nẵng</p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center gap-2">
                <strong>5</strong>
                <p>phòng ngủ</p>
              </div>
              <div className="flex items-center gap-2">
                <strong>5</strong>
                <p>phòng tắm</p>
              </div>
            </div>
            <div className="w-full flex items-center justify-center gap-8 mt-5">
              <button className="px-5 py-2 text-[#8bcaf7] border border-[#3CA9F9] rounded-lg">
                Chi tiết
              </button>
              <button className="px-5 py-2 text-[#3CA9F9] border border-[#3CA9F9] rounded-lg">
                Xóa bài đăng
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[80%] h-[40%] bg-white border-solid border-2 border-slate-200 rounded-xl mb-5">
        <div className="flex justify-between items-center px-6 py-2 ">
          <h2 className="text-lg font-semibold text-[#3CA9F9]">
            Bán nhà ở tại 123 Tôn Đức Thắng
          </h2>
          <button className="px-5 py-2 text-[#3CA9F9] border border-[#3CA9F9] rounded-lg">
            Đang bán
          </button>
        </div>

        <div className="flex flex-row px-4 py-2">
          <div className="w-[40%] pr-4">
            <img
              className="w-full h-[60%] object-cover rounded-md"
              src="https://th.bing.com/th/id/OIP.c_e6N6YtIVI2NFhW_Ugm6wHaF7?w=246&h=197&c=7&r=0&o=5&dpr=1.3&pid=1.7"
              alt="room_image"
            />
          </div>

          <div className="flex flex-col justify-between w-[55%] h-[55%] border-2 border-[#DCDCDC] p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-gray-700 text-lg font-bold">
              <p className="text-red-600">12 tỷ VND</p>
              <p className="text-red-600">1000m²</p>
            </div>

            <p className="text-gray-700">Hải Châu, Đà Nẵng</p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="flex items-center gap-2">
                <strong>5</strong>
                <p>phòng ngủ</p>
              </div>
              <div className="flex items-center gap-2">
                <strong>5</strong>
                <p>phòng tắm</p>
              </div>
            </div>
            <div className="w-full flex items-center justify-center gap-8 mt-5">
              <button className="px-5 py-2 text-[#8bcaf7] border border-[#3CA9F9] rounded-lg">
                Chi tiết
              </button>
              <button className="px-5 py-2 text-[#3CA9F9] border border-[#3CA9F9] rounded-lg">
                Xóa bài đăng
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Pagination
        accountsPerPage={2}
        totalAccounts={2}
        paginate={paginate}
      />
    </div>
  );
};

export default ListPosts;
