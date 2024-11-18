import FriendList from "../../components/Message/FriendList";
import ChatWindow from "../../components/Message/ChatWindow";
import { useState, useEffect } from "react";

const Chat = () => {
  const [selectedFriend, setSelectedFriend] = useState(() => {
    const savedFriend = localStorage.getItem("selectedFriend");
    return savedFriend ? JSON.parse(savedFriend) : null;
  });
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  useEffect(() => {
    localStorage.setItem("selectedFriend", JSON.stringify(selectedFriend));
  }, [selectedFriend]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="flex gap-7 h-[39rem] px-5 py-2 font-montserrat border-[1px] border-solid border-black">
      <FriendList selectFriend={setSelectedFriend} />
      {selectedFriend ? (
        <div className="w-full flex flex-col justify-between">
          <ChatWindow messages={messages} setMessages={setMessages} />
        </div>
      ) : (
        <div className="w-2/3 flex items-center justify-center">
          <p>Chọn một người để bắt đầu nhắn tin!</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
