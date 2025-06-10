const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

const jwtSecret = process.env.JWT_SECRET;
const FEverifyEmailURL = process.env.FRONTEND_VERIFY_URL;

const transporter =  nodemailer.createTransport({
service: 'gmail',
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
}   
});

router.get ('/', async (req, res) => {

try { 
// Get the token:
const authHeader = req.headers.authorization;
if(!authHeader || !authHeader.startsWith('Bearer ') ) {
    return res.status(401).json({ message: 'No token available, please try again or contact the dev.' })
}

const loginToken = authHeader.split(' ')[1];

// Verify the token:
let decoded;
try {
    decoded = jwt.verify(loginToken, jwtSecret);
} catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
}

// Find the user using the userId:
const user = await User.findById(decoded.userId);

if (!user) {
    return res.status(404).json({ message: 'User not found.' })
}

// generate token to verufy the email: 
const emailVerifyToken = jwt.sign(
    { id: user._id },
    jwtSecret,
    { expiresIn: '20m' }
)

const verifyEmailURL = `${FEverifyEmailURL}?token=${emailVerifyToken}`

// Send verify email email
const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Verify Email',
    html: `
     Hello ${user.firstName} ${user.lastName} Here is the email to change your password. Please use the link provided to change your password: 
     <a href="${verifyEmailURL}">${verifyEmailURL}</a>
this email will expire in 20 mins
    `
}

await transporter.sendMail(mailOptions)
res.json({ message: 'Email verification link sent.' })



} catch (error) {
    console.error('Error sending verification email', error);
    res.status(500).json({ message: 'Internal server error, please contact the website admin' })



}


});

module.exports = router;