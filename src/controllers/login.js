// controllers/login.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const PWisMatch = await bcrypt.compare(password, user.password);
    if (!PWisMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT with user info
    const token = jwt.sign({
      userId: user._id,
      firstName: user.firstName,
      email: user.email,
      isAdmin: user.isAdmin ?? false,
    }, process.env.JWT_SECRET, { expiresIn: '4h' });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 4 * 60 * 60 * 1000,
    });

    // ✅ Return both token and user object
    return res.json({
      token,
      user: {
        userId: user._id,
        firstName: user.firstName,
        email: user.email,
        isAdmin: user.isAdmin ?? false,
      }
    });

  } catch (error) {
    console.error('Login Error', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = userLogin;
