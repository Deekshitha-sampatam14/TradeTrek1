const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Allowed origins for CORS
const allowedOrigins = [
  'https://tradetrek-nu.vercel.app',
  'https://tradetrek-frontend.onrender.com',
  'http://localhost:3000',
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Static file serving (e.g., uploaded profile images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);

// Create server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send-message', ({ roomId, message, sender }) => {
    socket.to(roomId).emit('receive-message', { message, sender });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible throughout the app (optional)
app.set('io', io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
