// components/SideProjects.js
import React from "react";

export default function SideProjects() {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-[20rem]">
      <h2 className="text-lg mb-4">Danh sách bạn bè</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-yellow-400 p-4 rounded-lg flex justify-center items-center">
          <p>Vũ</p>
        </div>
        <div className="bg-blue-400 p-4 rounded-lg flex justify-center items-center">
          <p>Nhung</p>
        </div>
        <div className="bg-pink-400 p-4 rounded-lg flex justify-center items-center">
          <p>Quang</p>
        </div>
        <div className="bg-green-400 p-4 rounded-lg flex justify-center items-center">
          <p>Anh</p>
        </div>
      </div>
    </div>
  );
}
