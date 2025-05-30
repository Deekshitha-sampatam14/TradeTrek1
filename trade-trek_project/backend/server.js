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

// Allow multiple frontend origins
const allowedOrigins = [
  'https://tradetrek-nu.vercel.app',
  'https://tradetrek-frontend.onrender.com',
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// CORS middleware for Express
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello from backend');
});

// Socket.io handlers
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

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
