const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Authentication token required (Bearer format)'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'voltcycle-jwt-super-secret-key-32-chars-long-secure';
    
    const decoded = jwt.verify(token, secret);
    
    // Attach decoded user payload to request
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
