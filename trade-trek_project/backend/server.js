const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); 
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/messageModel');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure allowed origins - updated for Vercel deployment
const allowedOrigins = [
  'https://tradetrek-nu.vercel.app',       // Your new Vercel app
  'https://trade-trek.vercel.app',         // Alternative Vercel URL
  'http://localhost:3000',                 // Local development
  process.env.FRONTEND_URL                  // From environment variables
].filter(Boolean); // Remove any undefined values

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) in development
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Check if the origin is in the allowed list
    if (!origin || allowedOrigins.some(allowedOrigin => 
      origin.includes(new URL(allowedOrigin).hostname)
    )) {
      callback(null, true);
    } else {
      console.error('CORS blocked for origin:', origin);
      callback(new Error(`Not allowed by CORS. Allowed origins: ${allowedOrigins.join(', ')}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional security and CORS headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('X-Powered-By', 'TradeTrek Server');
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    allowedOrigins,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Socket.IO configuration - updated for Vercel
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling']
  },
  path: '/socket.io/', // Explicit path
  serveClient: false,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket.IO connection handler with enhanced logging
io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id} from ${socket.handshake.headers.origin}`);

  socket.on('join-room', async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);

    try {
      const previousMessages = await Message.find({ roomId }).sort({ timestamp: 1 }).limit(100);
      socket.emit('previous_messages', previousMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      socket.emit('error', { message: 'Failed to load chat history' });
    }
  });

  socket.on('send-message', async (data) => {
    try {
      const { sender, senderName, text, timestamp, roomId } = data;
      const newMessage = new Message({ 
        sender, 
        senderName, 
        text, 
        timestamp, 
        roomId 
      });
      await newMessage.save();
      io.to(roomId).emit('receive-message', data);
    } catch (error) {
      console.error('Message save error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id} (${reason})`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Database connection with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
    w: 'majority'
  })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Server startup
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  Server running on port ${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  Allowed origins: ${allowedOrigins.join(', ')}
  `);
});

// Process event handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});