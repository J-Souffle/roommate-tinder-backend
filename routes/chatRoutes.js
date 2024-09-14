// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Match = require('../models/Match');
const authMiddleware = require('../middleware/authMiddleware');

// Send a message
router.post('/send', authMiddleware, async (req, res) => {
  const { matchId, message } = req.body;

  try {
    const match = await Match.findById(matchId);

    // Ensure the match is accepted and the sender is part of the match
    if (!match || match.status !== 'accepted' || 
        (match.user1.toString() !== req.user._id.toString() && match.user2.toString() !== req.user._id.toString())) {
      return res.status(403).json({ msg: 'Unauthorized or match not found' });
    }

    const chat = new Chat({
      matchId,
      sender: req.user._id,
      message,
    });

    await chat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history for a match
router.get('/:matchId', authMiddleware, async (req, res) => {
  const { matchId } = req.params;

  try {
    const match = await Match.findById(matchId);

    // Ensure the match is accepted and the requester is part of the match
    if (!match || match.status !== 'accepted' || 
        (match.user1.toString() !== req.user._id.toString() && match.user2.toString() !== req.user._id.toString())) {
      return res.status(403).json({ msg: 'Unauthorized or match not found' });
    }

    const chats = await Chat.find({ matchId }).sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
