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

// ✅ Use your actual frontend deploy URL here:
const CLIENT_URL = process.env.CLIENT_URL || 'https://tradetrek-nu.vercel.app';

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ✅ CORS middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Hello from backend');
});

// WebSocket logic
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

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// ❌ No need to serve frontend build since it's deployed on Vercel
