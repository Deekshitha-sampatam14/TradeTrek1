import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL);

const TradespersonChats = () => {
  const location = useLocation();
  const { id, tname } = location.state || {};

  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchChats = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === "production"
  ? "https://tradetrek.onrender.com"
  : "http://localhost:5000";
  
      const response = await fetch(
        `${baseUrl}/api/auth/getTradespersonChats`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const data = await response.json();
      setChatList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChatList([]);
    }
  };

  const openChat = (clientName, roomId) => {
    setSelectedChat({ clientName, roomId });
    socket.emit("join-room", roomId);

    socket.on("previous_messages", (data) => setMessages(data));
    socket.on("receive-message", (data) => setMessages((prev) => [...prev, data]));
  };

  const sendMessage = () => {
    if (message.trim() === "" || !selectedChat) return;

    const newMessage = {
      sender: id,
      senderName: tname,
      text: message,
      timestamp: new Date().toISOString(),
      roomId: selectedChat.roomId,
    };

    socket.emit("send-message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Chat List */}
      <div className="w-1/3 bg-white shadow-lg border-r p-4">
        <h2 className="text-lg font-bold mb-4">Chats</h2>
        {chatList.length === 0 ? (
          <p className="text-gray-500">No chats yet.</p>
        ) : (
          chatList.map(({ clientId, clientName, roomId }) => (
            <div
              key={roomId}
              className="p-2 border-b cursor-pointer hover:bg-gray-200"
              onClick={() => openChat(clientName, roomId)}
            >
              {clientName}
            </div>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div className="w-2/3 flex flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b bg-gray-200 text-lg font-semibold">
              Chat with {selectedChat.clientName}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md max-w-[75%] ${
                    msg.sender === id ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-black self-start"
                  }`}
                >
                  <strong className="text-xs">{msg.sender === id ? "You" : msg.senderName}</strong>
                  <p>{msg.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t flex items-center gap-2 bg-gray-100">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg focus:outline-none"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={sendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default TradespersonChats;
