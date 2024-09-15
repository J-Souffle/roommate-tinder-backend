require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const chatRoutes = require('./routes/chatRoutes');
const housesRoutes = require('./routes/housesRoutes');
const Chat = require('./models/Chat');
const connectDB = require('./config/db');

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/houses', housesRoutes); // Add the houses routes here


// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New WS Connection...');

  socket.on('joinRoom', ({ matchId, userId }) => {
    if (!matchId || !userId) {
      console.error('Missing required fields: matchId and userId');
      return;
    }
    socket.join(matchId);
    console.log(`User ${userId} joined room: ${matchId}`);
  });

  socket.on('chatMessage', async ({ matchId, message, userId }) => {
    if (!matchId || !message || !userId) {
      console.error('Missing required fields: matchId, message, and userId');
      return;
    }

    try {
      const chat = new Chat({
        matchId,
        sender: userId,
        message,
      });

      await chat.save();
      io.to(matchId).emit('message', chat);
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).send('Server Error');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
