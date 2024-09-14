// routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const authMiddleware = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// Get all matches for the current user
router.get('/my-matches', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find matches where the current user is either user1 or user2
    const matches = await Match.find({
      $or: [
        { user1: userId },
        { user2: userId }
      ]
    });

    // Return matches or a message if none found
    if (matches.length > 0) {
      res.status(200).json(matches);
    } else {
      res.status(404).json({ msg: 'No matches found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a match request
router.post('/request', authMiddleware, async (req, res) => {
  const { userId } = req.body; // `userId` should be the ID of user2

  // Ensure `userId` is provided
  if (!userId) {
    return res.status(400).json({ msg: 'userId is required' });
  }

  try {
    // Check if a match request already exists
    const existingMatch = await Match.findOne({ 
      user1: req.user._id,
      user2: userId
    });

    if (existingMatch) {
      return res.status(400).json({ msg: 'Match request already sent' });
    }

    // Create a new match request
    const match = new Match({
      user1: req.user._id,
      user2: userId,
      status: 'pending' // Initial status of the match request
    });

    await match.save();
    res.status(200).json({ msg: 'Match request sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept a match request
router.post('/accept', authMiddleware, async (req, res) => {
  const { matchId } = req.body;

  // Validate `matchId`
  if (!mongoose.Types.ObjectId.isValid(matchId)) {
    return res.status(400).json({ msg: 'Invalid matchId' });
  }

  try {
    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ msg: 'Match not found' });
    }
    if (match.user2.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Unauthorized to accept this match' });
    }

    // Update match status to 'accepted'
    match.status = 'accepted';
    await match.save();
    res.status(200).json({ msg: 'Match accepted!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
