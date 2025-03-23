const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../../models/userModel');

// Email configuration using env vars
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/', async (req, res) => {
  try {
    const { isAdmin, firstName, lastName, email, password, number, address } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !number || !address) {
      return res.status(400).json({ message: "Please complete your profile details." });
    }

    const { street, brgy, city, province } = address;
    if (!street || !brgy || !city || !province) {
      return res.status(400).json({ message: "Please complete your address information." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      isAdmin,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      number,
      address: { street, brgy, city, province },
      isVerified: false, // Always false initially
    });

    await newUser.save();

    // Generate verification token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    // Prepare verification email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',        // Gmail SMTP server
      port: 465,                      // Secure port
      secure: true,                   // Use TLS
      auth: {
        user: process.env.EMAIL_USER,  // Your email
        pass: process.env.EMAIL_PASS   // App password
      }
    });

    const verificationLink = `http://localhost:3000/verify?token=${token}`; // Replace with your domain in production

    const mailOptions = {
      from: EMAIL_USER,
      to: newUser.email,
      subject: 'Please verify your email',
      html: `<h1>Email Verification</h1>
             <p>Click the link below to verify your account:</p>
             <a href="${verificationLink}">Verify Email</a>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Account created! Please check your email to verify your account." });

  } catch (error) {
    console.error("Error in creating an account", error);
    res.status(500).json({ message: "Error in creating an account", error: error.message });
  }
});

module.exports = router;
