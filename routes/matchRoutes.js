// routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const authMiddleware = require('../middleware/authMiddleware');

// User1 sends a match request to User2
router.post('/request', authMiddleware, async (req, res) => {
  const { userId } = req.body;

  try {
    const existingMatch = await Match.findOne({ 
      user1: req.user._id, 
      user2: userId 
    });

    if (existingMatch) {
      return res.status(400).json({ msg: 'Match request already sent' });
    }

    const match = new Match({
      user1: req.user._id,
      user2: userId,
      status: 'pending',
    });

    await match.save();
    res.status(200).json({ msg: 'Match request sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User2 accepts match request from User1
router.post('/accept', authMiddleware, async (req, res) => {
  const { matchId } = req.body;

  try {
    const match = await Match.findById(matchId);

    if (!match) return res.status(404).json({ msg: 'Match not found' });
    if (match.user2.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    match.status = 'accepted';
    await match.save();
    res.status(200).json({ msg: 'Match accepted!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
