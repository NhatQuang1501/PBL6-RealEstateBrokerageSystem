import React from "react";


import Img2 from "../../assets/image/hero-bg5.jpg"

const SideBarChat = ({ receiverUsernames, onUserClick,latestMessageC }) => {


  return (
    <div className="w-80 bg-white flex flex-col h-full p-1 ">
      <div className="text-lg font-semibold p-4">Chat Box</div>
      <form action="" className="relative px-4">
        <input
          type="search"
          className="py-2 px-4 bg-slate-100 border border-slate-300 outline-none w-full rounded pr-8 text-sm focus:border-slate-400"
          placeholder="Tìm kiếm ..."
        />
        <button
          type="submit"
          className="absolute top-1/2 right-8 text-slate-400 transform -translate-y-1/2 bg-transparent outline-none border-none cursor-pointer transition-colors duration-150 hover:text-slate-600"
        >
          <i className="ri-search-line"></i>
        </button>
      </form>
      <div className="overflow-y-auto h-full mt-4 w-full ">
        <div className="space-y-2 p-2">
          <label className="m-2 text-slate-400 w-full text-xs font-medium flex items-center">
            <span className="z-10 bg-white pr-1">Tin nhắn gần nhất</span>
            <hr className="border-1 border-gray-300 w-[160px]" />
          </label>
          <ul>
            {receiverUsernames.map((username, index) => (
              <li key={index}>
                <a
                  href="#!"
                  onClick={() => onUserClick(username)} 
                  className="flex items-center text-slate-700 py-2 px-4 hover:bg-slate-50 transition-colors duration-150"
                >
                  <img
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mr-3"
                    src={Img2}
                    alt=" "
                  />
                  <div className="flex-1 mr-3 ">
                    <span className="block text-sm font-medium">{username}</span>
                    <span className="text-xs text-slate-400 w-[150px] truncate block">
                      {latestMessageC}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-white bg-emerald-500 py-0.5 px-1.5 rounded">
                      5
                    </span>
                    <span className="text-xs text-slate-400 font-medium block">
                      12:30
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBarChat;

