const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWTSecret = process.env.JWT_SECRET;

router.get('/', async (req, res) => {

const { token } = req.query;

// token is provided: 

if (!token) {
    return res.status(400).json({ message: "Verification Token is missing" });
}

try {
    // Decode token:
const decoded = jwt.verify(token, JWTSecret);
// Get the userId from the decoded token: 
if (!decoded || !decoded.userId) {
return res.status(400).json({ message: "Invalid or malformed token." });
}

const userId = decoded.userId;

// Find the user from the DB: 
const user = await User.findById(userId);

if(!user) {
return res.status(404).json({ message: "User not found." })
}

// Checks if the user is already verified: 
if (user.isVerified) {
return res.status(200).json({ message: "This account is already verfied." })
}

user.isVerified = true;
await user.save();

// Check via console log: 
console.log('Account is now verified:', {
    email: user.email,
    isVerified: user.isVerified,
    updatedAt: user.updatedAt,
});


} catch (error) {
console.error('Error verifying email:', error.message);
return res.status(400).json({
    message: 'Invalid or expired token. Please try again',
    error: error.message,
});


}
});

module.exports = router;