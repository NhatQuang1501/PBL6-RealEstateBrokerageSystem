import React, { useState, useEffect } from "react";
import Img2 from "../../assets/image/hero-bg5.jpg";
import { useAppContext } from "../../AppProvider";
import Error from "../error/error";
import axios from "axios";
const BoxMessage = ({ selectedUser, receiverUsernames, latestMessageC }) => {
  const { role, sessionToken, name } = useAppContext();
  const [latestMes, setLatestMess] = useState(null);

  if (role !== "user") {
    <Error />;
  }
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/chat/messages/${selectedUser}`,
          {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          }
        );
        console.log(response);
        if (response.status === 200) {
          console.log("du lieu", response.data.messages);
          const formattedMessages = response.data.messages.map((message) => ({
            message_id: message.message_id,
            sender: message.sender_profile.user.username,
            receiver: message.receiver_profile.user.username,
            messageFor: message.message,
            created_at: message.created_at,
          }));
          console.log("dữ liệu trong", formattedMessages);

          setMessages(formattedMessages);
          const latestMessage = formattedMessages[formattedMessages.length - 1];
          if (latestMessage) {
            console.log("Tin nhắn mới nhất:", latestMessage);
            setLatestMess(latestMessage);
          }
          console.log("t", latestMes);
        } else {
          console.log("Lỗi rồi");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (sessionToken && selectedUser) {
      fetchPosts();
      const interval = setInterval(fetchPosts, 2000);

      return () => clearInterval(interval); 
    }
  }, [sessionToken, selectedUser]);
  useEffect(() => {
    console.log("latestMes:", latestMes);
    latestMessageC = latestMes;
    console.log("latestMesC:", latestMessageC);
  }, [latestMes]);
  function formatTime(createdAt) {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInMs = now - createdDate;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 1) {
      return `${diffInDays} ngày trước`;
    } else if (diffInHours >= 1) {
      return `${diffInHours} giờ trước`;
    } else if (diffInMinutes >= 1) {
      return `${diffInMinutes} phút trước`;
    } else {
      return `Vừa xong`;
    }
  }
  const [inputData, setInputData] = useState("");

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  const handleSubmit = async () => {
    console.log("Token hiện tại:", sessionToken);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/chat/messages/",
        {
          receiver_username: selectedUser,
          message: inputData,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        console.log("Success:", response.data);

        const newMessage = {
          message_id: response.data.message_id,
          sender: name, 
          receiver: selectedUser,
          messageFor: inputData,
          created_at: new Date().toISOString(), 
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInputData(""); 
      } else {
        console.error("Failed to submit data, status:", response.status);
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="w-[850px] h-full bg-slate-100">
      <div className="p-3 bg-white shadow-sm">
        <div className="flex gap-3">
          <img
            src={Img2}
            alt=""
            className="object-cover w-10 h-10 rounded-full"
          />
          <div className="flex flex-col justify-between">
            <strong>{selectedUser}</strong>
            <p className="text-[14px] opacity-60">Hoạt động 3 phút trước</p>
          </div>
        </div>
      </div>
      <div className="chat-detail p-4 h-[83vh]">
        <div className="messages mt-4 p-2 flex flex-col overflow-y-auto max-h-[78vh]">
          {messages.map((message) => (
            <div
              key={message.message_id}
              className={`message-item mb-2 p-3 rounded-lg w-fit max-w-[50%] break-words ${
                message.sender === name
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-black"
              }`}
            >
              <p>{message.messageFor}</p>
              <span className="text-[10px] opacity-70">
                {formatTime(message.created_at)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="conversation-form flex items-end bg-white p-2 mt-1">
        <button
          type="button"
          className="conversation-form-button flex items-center justify-center w-10 h-10 text-slate-400 rounded hover:bg-slate-100 hover:text-slate-600 active:bg-slate-200"
        >
          <svg
            className="w-[16px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
          </svg>
        </button>
        <div className="conversation-form-group w-full gap-3 flex flex-row mx-4">
          <textarea
            value={inputData}
            onChange={handleInputChange}
            className="conversation-form-input w-full bg-slate-100 border border-slate-300 rounded px-4 py-2 pr-8 text-sm leading-6 max-h-32 resize-none focus:border-slate-400"
            rows="1"
            placeholder="Nhập gì đó đi ..."
          ></textarea>
          <button
            type="button"
            className="conversation-form-record  text-slate-400 hover:text-slate-600"
          >
            <i className="ri-mic-line text-xl"></i>
          </button>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="conversation-form-button conversation-form-submit flex items-center justify-center w-10 h-10 bg-emerald-500 text-white rounded shadow-md shadow-emerald-500 hover:bg-emerald-600 active:bg-emerald-700"
        >
          <svg
            className="w-[16px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BoxMessage;
