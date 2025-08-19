// middleware/isLoggedin.js
const jwt = require('jsonwebtoken');

const isLoggedin = (req, res, next) => {
  try {
    // Check if token exists in cookies
    const token = req.cookies?.token; // <- optional chaining prevents undefined errors
    if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();

  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = isLoggedin;
