const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');  
const User = require('../models/userModel');

const jwtSecret = process.env.JWT_SECRET;

router.post('/', async (req, res) => {
    const { token, newPassword } = req.body;

try {
const decoded = jwt.verify(token, jwtSecret)
const user = await User.findById(decoded.userId);

if (!user) {
return res.status(404).json({ message: 'User not found' });
}

const hashedPassword = await bcrypt.hash(newPassword, 10);
user.password = hashedPassword;
await user.save();

res.json({ message: 'Password has been reset successfully' })


} catch (err) {

console.error('Reset error:', err);
res.status(400).json({ message: 'Invalid or expired token.' })
}
});

module.exports = router;
