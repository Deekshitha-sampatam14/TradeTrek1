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

// All possible frontend URLs (current and previous)
const allowedOrigins = [
  'https://trade-trek.vercel.app',          // Current Vercel frontend
  'https://tradetrek-nu.vercel.app',        // Alternative Vercel URL
  'https://tradetrek-frontend.onrender.com', // Previous Render frontend
  'http://localhost:3000',                  // Local development
  process.env.FRONTEND_URL                  // From environment variables
].filter(Boolean); // Remove any undefined values

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin in development
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Allow all subdomains of vercel.app and render.com
    const allowedPatterns = [
      /\.vercel\.app$/,
      /\.render\.com$/,
      /localhost(:\d+)?$/
    ];

    if (!origin || allowedPatterns.some(pattern => pattern.test(origin)) {
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Additional headers middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    allowedOrigins,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io/',
  transports: ['websocket', 'polling']
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('join-room', async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    try {
      const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
      socket.emit('previous_messages', messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  });

  socket.on('send-message', async (data) => {
    try {
      const newMessage = new Message(data);
      await newMessage.save();
      io.to(data.roomId).emit('receive-message', data);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Allowed origins:', allowedOrigins);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});