// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware'); // Import the middleware

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, pets, occupation, rentPriceRange, smoker, socialLife, sleepSchedule, areaPreference, moveInDate, houseType, leaseDuration, cleanlinessLevel, workSchedule, favoriteHomes } = req.body;

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
      pets,
      occupation,
      rentPriceRange,
      smoker,
      socialLife,
      sleepSchedule,
      areaPreference,
      moveInDate,
      houseType,
      leaseDuration,
      cleanlinessLevel,
      workSchedule,
      favoriteHomes
    });

    // Save user to the database
    await user.save();

    // Send response with user info (excluding actual password)
    res.status(201).json({
      msg: 'User registered successfully!',
      user: {
        name,
        email,
        pets,
        occupation,
        rentPriceRange,
        smoker,
        socialLife,
        sleepSchedule,
        areaPreference,
        moveInDate,
        houseType,
        leaseDuration,
        cleanlinessLevel,
        workSchedule,
        favoriteHomes
      }
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
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Create and send JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, pets, occupation, rentPriceRange, smoker, socialLife, sleepSchedule, areaPreference, moveInDate, houseType, leaseDuration, cleanlinessLevel, workSchedule, favoriteHomes } = req.body;

  try {
    // Update the user profile
    const user = await User.findByIdAndUpdate(
      req.user._id, // Access user ID from req.user
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

// Get user profile by ID
router.get('/profile/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(id).select('-password'); // Exclude password from response
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route to check if auth routes are working
router.get('/test', (req, res) => {
  res.send('Auth route is working!');
});

module.exports = router;
