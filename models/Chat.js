const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the chat schema
const chatSchema = new Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match', // Reference to the Match schema
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User schema (sender of the message)
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the Chat model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
