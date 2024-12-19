import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const JWT_SECRET=123;

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token,JWT_SECRET );
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};

export const provider = (req, res, next) => {
  if (req.user ) { //&& (req.user.role === 'provider' || req.user.role === 'admin'
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as provider' });
  }
};