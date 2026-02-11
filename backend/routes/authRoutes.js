import express from 'express';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Simple login - just save name and password
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    // Validate input
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    // Create/save user to database
    const user = new User({
      name,
      password, // Storing plain text for simplicity
    });

    await user.save();
    
    res.status(200).json({
      message: 'Login successful',
      user: { name: user.name, id: user._id },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});





/**
 * @route   GET /api/auth/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
