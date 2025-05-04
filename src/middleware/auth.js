const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
  // Extract token from Authorization header (Bearer <token>)
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if token is not found
  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Log the decoded token for debugging purposes
    console.log("Decoded Token:", decoded);

    // Ensure the required properties are in the decoded token
    if (!decoded.userId || typeof decoded.isAdmin !== 'boolean' || !decoded.firstName) {
      return res.status(400).json({ message: "Invalid token structure" });
    }

    // Attach user information to req.user object for use in other routes
    req.user = {
      userId: decoded.userId,
      firstName: decoded.firstName,
      isAdmin: decoded.isAdmin,
      email: decoded.email
    };

    // Proceed to the next middleware or route handler
    next();

  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

module.exports = isLoggedIn;
