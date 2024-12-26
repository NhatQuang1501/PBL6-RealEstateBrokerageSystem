import React, { useState } from "react";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMsg) => prevMsg + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="relative w-full h-[3rem] rounded-lg mt-1 flex items-center gap-3">
      <div className="relative flex-grow flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute right-2 text-gray-500 hover:text-gray-700"
        >
          <FaSmile className="text-xl" />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 right-0 z-50">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>
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
