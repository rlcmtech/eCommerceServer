const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');  
const User = require('../models/userModel');

const jwtSecret = process.env.JWT_SECRET;

router.post('/', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.userId;

        // Find user by ID 
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Save the new password
        user.password = hashedPassword;
        await user.save();

        // Send success response (res.sendStatus can't be chained with .json)
        res.status(200).json({ message: "Password reset successfully." });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(400).json({ message: "Invalid or expired token.", error: error.message });
    }
});

module.exports = router;
