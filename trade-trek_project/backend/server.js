// server.js

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

// Define the allowed origin
const allowedOrigin = 'https://tradetrek-nu.vercel.app';

// Configure CORS options
const corsOptions = {
  origin: allowedOrigin,
  methods: ['GET', 'POST'],
  credentials: true,
};

// Apply CORS middleware to Express
app.use(cors(corsOptions));

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello from backend');
});

// Initialize Socket.IO with CORS options
const io = new Server(server, {
  cors: corsOptions,
});

// Handle Socket.IO connections
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

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
