const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // Exclude password from user object
    if (!user) return res.status(401).json({ msg: 'Invalid token' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = authMiddleware;
