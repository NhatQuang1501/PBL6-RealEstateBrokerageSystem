// components/SideProjects.js
import React from "react";

export default function SideProjects() {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg mb-4">Side-Projects</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-yellow-400 p-4 rounded-lg flex justify-center items-center">
          <p>Project 1</p>
        </div>
        <div className="bg-blue-400 p-4 rounded-lg flex justify-center items-center">
          <p>Project 2</p>
        </div>
        <div className="bg-pink-400 p-4 rounded-lg flex justify-center items-center">
          <p>Project 3</p>
        </div>
        <div className="bg-green-400 p-4 rounded-lg flex justify-center items-center">
          <p>Project 4</p>
        </div>
      </div>
    </div>
  );
}
