const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const Message = require('./models/messageModel');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Get the port from environment (important for Render)
const PORT = process.env.PORT || 5000;

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://tradetrek-nu.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://tradetrek-nu.vercel.app',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Hello from backend');
});

// Socket.IO handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', async (roomId) => {
    socket.join(roomId);
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
    socket.emit('previous_messages', messages);
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

// MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
