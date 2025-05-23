const express = require('express');
const path=require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); 
const cors = require('cors');
const http=require('http');
const {Server}=require('socket.io');
const Message = require("./models/messageModel");


 // Enable CORS for all routes
 // Ensure correct path

dotenv.config();
const app = express();

const server=http.createServer(app);
const io=new Server(server,{

  cors:{
    origin:"http://localhost:3000",
    methods:['GET','POST'],

  }
});


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
 // Us
// Middleware for parsing JSON
 app.use(express.json());
 app.use(express.urlencoded());
 app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the auth routes for any paths starting with /api/auth
app.use('/api/auth', authRoutes);  // This is where you register your routes

app.get('/',(req,res)=>{
  res.send("hello");
})



// WebSocket Logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins a chat room
  socket.on("join-room", async (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);

      const previousMessages = await Message.find({ roomId }).sort({ timestamp: 1 });
  socket.emit("previous_messages", previousMessages);
  });

  // When a user sends a message
  socket.on("send-message", async (data) => {
    const {sender,senderName,text,timestamp, roomId} = data;
    
    // Save to MongoDB
  const newMessage = new Message({ sender,senderName, text, timestamp, roomId });
  await newMessage.save();
    

      io.to(roomId).emit("receive-message", data);
  });

  
  socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
  });
});





// Start the server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.log(err));


  // Serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
});