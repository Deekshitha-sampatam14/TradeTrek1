const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); 
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/messageModel');

dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://tradetrek-frontend.onrender.com',  // your deployed frontend URL
    methods: ['GET', 'POST'],
  },
});

// Enable CORS middleware with your frontend URL
app.use(cors({
  origin: 'https://tradetrek-frontend.onrender.com',
  credentials: true,
}));

// Middleware for parsing JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder for images/files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use your auth routes under /api/auth
app.use('/api/auth', authRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello from backend');
});

// WebSocket Logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', async (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    const previousMessages = await Message.find({ roomId }).sort({ timestamp: 1 });
    socket.emit('previous_messages', previousMessages);
  });

  socket.on('send-message', async (data) => {
    const { sender, senderName, text, timestamp, roomId } = data;
    const newMessage = new Message({ sender, senderName, text, timestamp, roomId });
    await newMessage.save();

    io.to(roomId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)  // no need for deprecated options
  .then(() => {
    console.log('MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Optional: Only serve frontend build if backend and frontend are in same project and deployed together
// Since you deployed frontend separately, you can comment out these lines:

/*
// Serve frontend build statically
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
});
*/
