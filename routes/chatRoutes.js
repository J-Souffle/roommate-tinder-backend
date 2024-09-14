const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Match = require('../models/Match');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// Get matchId and userId for the current user
router.get('/getMatchAndUser', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const matchId = '60d5f60f8a4a1c6f5a4e9a8f'; // Example matchId

        if (!mongoose.Types.ObjectId.isValid(matchId)) {
            return res.status(400).json({ msg: 'Invalid matchId' });
        }

        res.json({ matchId, userId });
    } catch (error) {
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
    const match = await Match.findById(matchId);

    if (!match || match.status !== 'accepted' || 
        (match.user1.toString() !== req.user._id.toString() && match.user2.toString() !== req.user._id.toString())) {
      return res.status(403).json({ msg: 'Unauthorized or match not found' });
    }

    const chat = new Chat({
      matchId,
      sender: req.user._id,
      message,
      timestamp: new Date() // Set current timestamp
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

    if (!matchId) {
        return res.status(400).json({ msg: 'matchId is required' });
    }

    try {
        // Debugging statements
        console.log('User ID:', req.user._id);
        console.log('Match ID:', matchId);

      
        // const match = await Match.findById(matchId);
        // console.log('Match:', match); 

       
        // if (!match) {
        //     return res.status(404).json({ msg: `Match not found for matchId: ${matchId}` });
        // }
        // if (match.status !== 'accepted') {
        //     return res.status(403).json({ msg: `Match is not accepted. Current status: ${match.status}` });
        // }
        // if (match.user1.toString() !== req.user._id.toString() && match.user2.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ msg: `User is not part of this match. matchId: ${matchId}` });
        // }

        // Fetch and return the chat history
        const chats = await Chat.find({ matchId }).sort({ timestamp: 1 });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  

module.exports = router;
