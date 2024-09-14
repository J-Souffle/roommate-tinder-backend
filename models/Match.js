// models/Match.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const matchSchema = new Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted'], 
    default: 'pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
