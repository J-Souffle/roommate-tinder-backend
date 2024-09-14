const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Match = require('../models/Match');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');


// Get matchId and userId for the current user
router.get('/getMatchAndUser', authMiddleware, async (req, res) => {
    console.log('GET /getMatchAndUser route hit');
    console.log('Request Headers:', req.headers);
    console.log('Request User:', req.user);

    try {
        const userId = req.user._id;
        const matchId = '60d5f60f8a4a1c6f5a4e9a8f'; // Example matchId

        if (!mongoose.Types.ObjectId.isValid(matchId)) {
            return res.status(400).json({ msg: 'Invalid matchId' });
        }

        res.json({ matchId, userId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Send a message
router.post('/send', authMiddleware, async (req, res) => {
  const { matchId, message } = req.body;

  if (!matchId || !message) {
    return res.status(400).json({ msg: 'matchId and message are required' });
  }

  try {
    console.log(`Received message for matchId: ${matchId}`);

    const match = await Match.findById(matchId);
    console.log('Match found:', match);

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
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get chat history for a match
router.get('/:matchId', authMiddleware, async (req, res) => {
  const { matchId } = req.params;

  if (!matchId) {
    return res.status(400).json({ msg: 'matchId is required' });
  }

  try {
    console.log(`Fetching chat history for matchId: ${matchId}`);

    const match = await Match.findById(matchId);
    console.log('Match found:', match);

    if (!match || match.status !== 'accepted' || 
        (match.user1.toString() !== req.user._id.toString() && match.user2.toString() !== req.user._id.toString())) {
      return res.status(403).json({ msg: 'Unauthorized or match not found' });
    }

    const chats = await Chat.find({ matchId }).sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
