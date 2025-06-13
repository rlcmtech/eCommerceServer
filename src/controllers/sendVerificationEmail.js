const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');



const jwtSecret = process.env.JWT_SECRET;
const FEverifyEmailURL = process.env.FRONTEND_VERIFY_URL; 
// Setup mail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.get('/', async (req, res) => {
  try {
    // Step 1: Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'No token provided. Please log in to verify your email.',
      });
    }

    const loginToken = authHeader.split(' ')[1];

    // Step 2: Verify the token
    let decoded;
    try {
      decoded = jwt.verify(loginToken, jwtSecret);
      console.log('Decoded login token:', decoded);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // Step 3: Validate token structure
    if (!decoded.userId) {
      return res.status(400).json({ message: 'Invalid token structure.' });
    }

    // Step 4: Find the user in the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Step 5: Create a short-lived token for email verification
    const emailVerifyToken = jwt.sign(
      { userId: user._id },
      jwtSecret,
      { expiresIn: '20m' }
    );

    const verifyEmailURL = `${FEverifyEmailURL}?token=${emailVerifyToken}`;

    // Step 6: Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <p>Hello ${user.firstName} ${user.lastName},</p>
        <p>Please click the link below to verify your email address. This link will expire in 20 minutes.</p>
        <a href="${verifyEmailURL}">${verifyEmailURL}</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Verification email sent successfully.' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ message: 'Internal server error. Please contact support.' });
  }
});

module.exports = router;
