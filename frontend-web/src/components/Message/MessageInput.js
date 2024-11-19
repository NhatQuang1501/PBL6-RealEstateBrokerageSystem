import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSend = () => {
    if (message.trim().length > 500) {
      setError("Tin nhắn không được vượt quá 500 ký tự.");
      return;
    }

    if (message.trim()) {
      onSend(message);
      setMessage("");
      setError("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="w-full h-[3rem] rounded-lg mt-1 flex items-center gap-3">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Nhập tin nhắn..."
        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSend}
        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <FaPaperPlane className="mr-2" />
        Gửi
      </button>
      {error && <p className="text-red-500 text-sm ml-2">{error}</p>}
    </div>
  );
};

export default MessageInput;
