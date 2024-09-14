const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming sender is an ObjectId and referring to the User model
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now // Set default to current date and time
  },
}, { timestamps: true }); // This adds createdAt and updatedAt fields

module.exports = mongoose.model('Chat', ChatSchema);
