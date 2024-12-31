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

  const clearFriendInfo = () => {
    setFriendInfo({});
    localStorage.setItem("friendInfo", JSON.stringify({}));
  };

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

  const handleSelectFriend = (
    chatroomId,
    postId,
    negoId,
    avatar,
    userName,
    userId,
    type
  ) => {
    setSelectedFriend(chatroomId);
    setFriendInfo({ avatar, userName, userId, postId, negoId, type });
    console.log("post id=======1>", postId);
    console.log("nego id=======1>", negoId);
    console.log("type=======1>", type);
  };

  return (
    <div className="flex gap-7 h-[42.5rem] bg-gradient-to-r from-blue-100 to-blue-200 px-5 py-2 font-montserrat">
      <FriendList selectFriend={handleSelectFriend} />
      {selectedFriend ? (
        <div className="w-full flex flex-col justify-between">
          <ChatWindow
            chatroomId={selectedFriend}
            messages={messages}
            setMessages={setMessages}
            friendInfo={friendInfo}
            clearFriendInfo={clearFriendInfo}
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
