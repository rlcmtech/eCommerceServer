const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Make sure this path is correct

const isLoggedIn = async (req, res, next) => {
  const token = req.cookies.token; // req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(400).json({ message: "Invalid token structure" });
    }

    const user = await User.findById(decoded.userId); // 👈 Important: fetch user from DB

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the full user object to req.user
    req.user = user;

    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

module.exports = isLoggedIn;
