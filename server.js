require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const matchRoutes = require('./routes/matchRoutes');
const chatRoutes = require('./routes/chatRoutes');
const Chat = require('./models/Chat'); // Assuming you have a Chat model
const connectDB = require('./config/db'); // Database connection

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Connect to MongoDB
connectDB();

// Middleware for JSON parsing
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chats', chatRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New WS Connection...');

  // Joining a room for a match
  socket.on('joinRoom', ({ matchId }) => {
    socket.join(matchId);
    console.log(`User joined room: ${matchId}`);
  });

  // Handle chat messages
  socket.on('chatMessage', async ({ matchId, message, userId }) => {
    try {
      // Create a new chat message
      const chat = new Chat({
        matchId,
        sender: userId,
        message,
      });

      // Save the chat message to the database
      await chat.save();

      // Emit the new message to all users in the room
      io.to(matchId).emit('message', chat);
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
