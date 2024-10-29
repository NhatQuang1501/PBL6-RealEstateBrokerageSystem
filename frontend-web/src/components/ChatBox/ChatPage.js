import React, { useState, useEffect } from "react";
import BoxMessage from "./BoxMessage";
import NavbarChat from "./NavbarChat";
import SideBarChat from "./SideBarChat";
import { useAppContext } from "../../AppProvider";
import axios from 'axios';
import Error from "../error/error";
const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { role, sessionToken, name } = useAppContext();
  const [receiverUsernames, setReceiverUsernames] = useState([]);
  const [latestMessageC] = useState(null);
  if(role!=='user'){
    <Error/>
  }
  const handleUserClick = (username) => {
    setSelectedUser(username);
    console.log( selectedUser);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/chat/messages/', {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
  
       
        const recentMessages = {};
        
        response.data.messages.forEach((message) => {
          const username = message.receiver_profile?.user?.username;
        const createdAt = new Date(message.created_at);
  
          
          if (username && username !== name) {
            if (!recentMessages[username] || createdAt > recentMessages[username]) {
              recentMessages[username] = createdAt;
            }
          }
        });
  
        // Biến object thành mảng và sắp xếp theo thời gian
        const sortedUsernames = Object.entries(recentMessages)
          .sort(([, timeA], [, timeB]) => timeB - timeA)
          .map(([username]) => username);
  
        setReceiverUsernames(sortedUsernames);
        
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    if (sessionToken) {
      fetchPosts();
    }
  }, [sessionToken, name]);

console.log("C",latestMessageC);
  return (
    <div className="flex w-full h-screen bg-white m-auto font-montserrat">
      <NavbarChat />
      {latestMessageC}
      <SideBarChat onUserClick={handleUserClick} receiverUsernames={receiverUsernames} latestMessageC={latestMessageC}/>
      
      <BoxMessage selectedUser={selectedUser} receiverUsernames={receiverUsernames} latestMessageC={latestMessageC}/>
    </div>
  );
};

export default ChatPage;
