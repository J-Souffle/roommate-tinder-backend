const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user to the request object
    req.user = await User.findById(decoded.id).select('-password');
    
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
