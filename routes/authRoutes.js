const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  try {
    // Convert and trim email
    const lowerCaseEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: lowerCaseEmail });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    // Create a new user
    const user = new User({
      name,
      email: lowerCaseEmail,
      password
    });

    // Save user to the database
    await user.save();

    // Send response with user info (excluding actual password)
    res.status(201).json({
      msg: 'User registered successfully!',
      user: {
        name,
        email
        // Do not send password in response
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
  

// Test route to check if auth routes are working
router.get('/test', (req, res) => {
  res.send('Auth route is working!');
});

module.exports = router;
