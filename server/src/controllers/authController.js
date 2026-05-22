const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Email and password are required' } 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Password must be at least 6 characters' } 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = User.createUser({
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN 
    });

    res.status(201).json({ 
      success: true, 
      data: { 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token 
      } 
    });
  } catch (error) {
    if (error.message === 'Email already registered') {
      return res.status(409).json({ 
        success: false, 
        error: { message: error.message } 
      });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: { message: 'Email and password are required' } 
      });
    }

    const user = User.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Invalid email or password' } 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Invalid email or password' } 
      });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN 
    });

    res.json({ 
      success: true, 
      data: { 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token 
      } 
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  // For JWT-based auth, logout is handled client-side by removing the token
  res.json({ success: true, data: { message: 'Logged out successfully' } });
};

const getMe = (req, res, next) => {
  try {
    const userId = req.userId;
    const user = User.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'User not found' } 
      });
    }

    res.json({ 
      success: true, 
      data: { 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      } 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, getMe };
