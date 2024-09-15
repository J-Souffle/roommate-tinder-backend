const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return res.status(401).json({ msg: 'User not found' });
        }
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
