const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const userLogout = async (req, res) => {
res.clearCookie('token', {
httpOnly: true,
secure: process.env.NODE_ENV === 'production',
sameSite: 'strict'
});
res.status(200).json({ message: ' Logged out successfully.'})
};

module.exports = userLogout