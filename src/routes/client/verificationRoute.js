const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');

const jwtSecret = process.env.JWT_SECRET;

router.get('/', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: "Verification token is missing." });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Account already verified.' });
        }

        // ✅ Mark user as verified and save
        user.isVerified = true;
        await user.save();

        // ✅ Send success response
        res.status(200).json({ message: 'Email successfully verified. You can now log in.' });

    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(400).json({ message: 'Invalid or expired verification link.', error: error.message });
    }
});

module.exports = router;
