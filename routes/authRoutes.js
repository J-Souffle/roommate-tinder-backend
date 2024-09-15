require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to the database
    await user.save();

    // Send response with user info (excluding actual password)
    res.status(201).json({
      msg: 'User registered successfully!',
      user: {
        name,
        email,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Create and send JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, age, budget, housePreference, city, state, bio, isSmokingOk, arePetsOk, sleepTime, moveInDate, occupation, profilePicture, favoriteHomes } = req.body;

  try {
    console.log('Updating user with data:', req.body); // Log incoming data

    // Update the user profile
    const user = await User.findByIdAndUpdate(
      req.user._id, // Access user ID from req.user
      { 
        name, 
        age, 
        budget, 
        housePreference, 
        city, 
        state, 
        bio, 
        isSmokingOk, 
        arePetsOk, 
        sleepTime, 
        moveInDate, 
        occupation, 
        profilePicture, 
        favoriteHomes 
      },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      msg: 'User profile updated successfully!',
      user
    });
  } catch (error) {
    console.error('Error updating user profile:', error); // Log the error
    res.status(400).json({ error: error.message });
  }
});

// Get user profile by ID
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Find the user by ID from the token
    const user = await User.findById(req.user._id).select('-password'); // Exclude password from response
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
