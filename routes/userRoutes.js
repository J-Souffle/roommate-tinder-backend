const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Import the middleware

// Get all users (for admin use or similar purpose)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords from the response
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single user by ID
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('-password'); // Exclude password from response
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user by ID
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, pets, occupation, rentPriceRange, smoker, socialLife, sleepSchedule, areaPreference, moveInDate, houseType, leaseDuration, cleanlinessLevel, workSchedule, favoriteHomes } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, pets, occupation, rentPriceRange, smoker, socialLife, sleepSchedule, areaPreference, moveInDate, houseType, leaseDuration, cleanlinessLevel, workSchedule, favoriteHomes },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      msg: 'User profile updated successfully!',
      user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({ msg: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
