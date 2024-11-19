import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../../AppProvider";
import MessageInput from "./MessageInput";
import { FaUserCircle, FaRegSmile } from "react-icons/fa";

const ChatWindow = ({ chatroomId, messages, setMessages, friendInfo }) => {
  const { sessionToken, id } = useAppContext();
  // const chatroomId = "c64169f0-85b2-4c9c-940c-7b561d961172";
  const wsUrl = `ws://127.0.0.1:8000/ws/chat/${chatroomId}/?token=${sessionToken}`;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data); // Log dữ liệu nhận được từ WebSocket

      // Kiểm tra dữ liệu nhận được có phải là mảng `messages` hay không
      if (data.messages && Array.isArray(data.messages)) {
        console.log("Received chat messages:", data.messages); // Log danh sách tin nhắn nhận được

        // Cập nhật state với tin nhắn mới
        setMessages((prevMessages) => {
          // Lọc những tin nhắn mới chưa có trong prevMessages
          const newMessages = data.messages.filter(
            (newMessage) =>
              !prevMessages.some(
                (existingMessage) =>
                  existingMessage.message_id === newMessage.message_id
              )
          );

          // Nếu có tin nhắn mới, thêm vào prevMessages và return lại mảng mới
          if (newMessages.length > 0) {
            return [...prevMessages, ...newMessages];
          }

          // Nếu không có tin nhắn mới, giữ nguyên prevMessages
          return prevMessages;
        });
      } else {
        console.log("No valid messages or incorrect data format received");
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Dọn dẹp khi component unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [wsUrl, sessionToken, setMessages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isOwnMessage = (sender) => sender === id;

  const handleSendMessage = (messageContent) => {
    const newMessage = {
      message: messageContent,
    };

    // Gửi tin nhắn qua WebSocket
    const socket = new WebSocket(wsUrl);
    socket.onopen = () => {
      socket.send(JSON.stringify(newMessage));
    };
  };

  const isNewDay = (currentMessage, previousMessage) => {
    const currentDate = new Date(currentMessage.created_at).toDateString();
    const previousDate = previousMessage
      ? new Date(previousMessage.created_at).toDateString()
      : null;
    return currentDate !== previousDate;
  };

  return (
    <div className="w-full mx-auto rounded-lg">
      <div className="">
        <div className="flex items-center mb-4 bg-gradient-to-r from-blue-400 to-blue-600 p-2 rounded-lg shadow-md">
          <img
            src={"http://127.0.0.1:8000" + friendInfo.avatar}
            alt="Avatar"
            className="w-12 h-12 rounded-full mr-4 object-cover bg-gray-200 border-[1px] border-[#3CA9F9] border-solid"
          />
          <h2 className="text-lg font-bold text-white flex items-center">
            {friendInfo.userName}
          </h2>
          <FaRegSmile className="ml-auto text-white text-2xl" />
        </div>
        <div className="h-[30rem] overflow-y-auto flex flex-col gap-3 bg-gray-50 p-4 rounded-lg border-[2px] border-solid border-gray-200">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <React.Fragment
                key={message.message_id || `temp-${Math.random()}`}
              >
                {index === 0 || isNewDay(message, messages[index - 1]) ? (
                  <div className="flex items-center my-10">
                    <div className="flex-grow border-t border-solid border-gray-300"></div>
                    <span className="mx-4 text-gray-500">
                      {new Date(message.created_at).toLocaleDateString(
                        "vi-VN",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                    <div className="flex-grow border-t border-solid border-gray-300"></div>
                  </div>
                ) : null}
                <div
                  className={`flex ${
                    isOwnMessage(message.sender)
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-2xl p-3 rounded-3xl shadow-lg break-words whitespace-pre-wrap ${
                      isOwnMessage(message.sender)
                        ? "bg-green-100 text-green-900"
                        : "bg-blue-100 text-blue-900"
                    }`}
                  >
                    <p className="text-md font-semibold">{message.content}</p>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {new Date(message.created_at).toLocaleTimeString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="w-full flex items-center justify-center h-full">
              <p className="font-bold text-lg">
                Hãy bắt đầu một tin nhắn mới !
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatWindow;
