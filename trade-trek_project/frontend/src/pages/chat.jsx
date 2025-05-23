import React, { useState, useEffect,useRef } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL); // Connect to the backend

const Chat = ({ tradespersonId, clientId ,userName}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const roomId = [tradespersonId, clientId].sort().join("_"); // Unique Room ID


  const messagesEndRef = useRef(null); // Reference for auto-scroll

  // When component loads, join chat room
  useEffect(() => {
    socket.emit("join-room", roomId); // Join room

    socket.on("receive-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); // Update chat messages
    });

     // Load previous messages
     socket.on("previous_messages", (data) => {
        setMessages(data);
        setLoading(false); // Messages loaded
      });

    return () => {
      socket.off("receive-message"); // Cleanup
      socket.off("previous_messages");
    };
  }, [roomId]);


  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  // Function to send messages
  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      sender: clientId,
      senderName: userName,
      text: message,
      timestamp: new Date().toISOString(),
      roomId,
    };

    socket.emit("send-message", newMessage);
    setMessages((prev) => [...prev, newMessage]); // Update messages locally
    setMessage("");
  };

  return (
    <div className="p-4 border rounded-lg w-96">
      <h2 className="text-lg font-bold">Chat</h2>
      <div className="h-60 overflow-y-auto bg-gray-100 p-3 rounded-lg mb-3">
      {loading ? <p className="text-gray-500">Loading chat...</p> : null}
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-2 rounded-md max-w-xs ${msg.sender === clientId ? "bg-blue-300 text-white ml-auto" : "bg-gray-300"}`}>
            <strong>{msg.sender === clientId ? "You" : "Tradesperson"}: </strong>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
