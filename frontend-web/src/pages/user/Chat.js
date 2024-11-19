import FriendList from "../../components/Message/FriendList";
import ChatWindow from "../../components/Message/ChatWindow";
import { useState, useEffect } from "react";

const Chat = () => {
  const [selectedFriend, setSelectedFriend] = useState(() => {
    const savedFriend = localStorage.getItem("selectedFriend");
    return savedFriend ? JSON.parse(savedFriend) : null;
  });
  const [messages, setMessages] = useState([]);
  const [friendInfo, setFriendInfo] = useState(() => {
    const savedFriendInfo = localStorage.getItem("friendInfo");
    return savedFriendInfo ? JSON.parse(savedFriendInfo) : {};
  });

  useEffect(() => {
    if (selectedFriend) {
      const savedMessages = localStorage.getItem(`messages_${selectedFriend}`);
      setMessages(savedMessages ? JSON.parse(savedMessages) : []);
    }
  }, [selectedFriend]);

  useEffect(() => {
    if (selectedFriend) {
      localStorage.setItem(
        `messages_${selectedFriend}`,
        JSON.stringify(messages)
      );
    }
  }, [messages, selectedFriend]);

  useEffect(() => {
    localStorage.setItem("selectedFriend", JSON.stringify(selectedFriend));
    localStorage.setItem("friendInfo", JSON.stringify(friendInfo));
  }, [selectedFriend, friendInfo]);

  const handleSelectFriend = (chatroomId, avatar, userName, userId) => {
    setSelectedFriend(chatroomId);
    setFriendInfo({ avatar, userName, userId });
  };

  return (
    <div className="flex gap-7 h-[39rem] px-5 py-2 font-montserrat">
      <FriendList selectFriend={handleSelectFriend} />
      {selectedFriend ? (
        <div className="w-full flex flex-col justify-between">
          <ChatWindow
            chatroomId={selectedFriend}
            messages={messages}
            setMessages={setMessages}
            friendInfo={friendInfo}
          />
        </div>
      ) : (
        <div className="w-full flex items-center justify-center h-full">
          <p className="w-auto">Chọn một người để bắt đầu nhắn tin!</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
