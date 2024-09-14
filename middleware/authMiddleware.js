// authMiddleware.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    console.log('Received Token:', token); // Log the received token
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log the JWT_SECRET

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    next();
  } catch (error) {
    console.error('Authentication error:', error.message); // Log detailed error
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
