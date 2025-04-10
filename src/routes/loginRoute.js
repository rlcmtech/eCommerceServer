const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found.');
    }

    const PWisMatch = await bcrypt.compare(password, user.password);
    if (!PWisMatch) {
      return res.status(400).send("Invalid credentials");
    }

    // Log the user object before creating the token
    console.log("User object at login:", user);

    // Generate JWT with user data and include isAdmin
    const token = jwt.sign({
      userId: user.id,
      firstName: user.firstName,
      email: user.email,
      isAdmin: user.isAdmin ?? false, // Ensure isAdmin is included
    }, process.env.SECRET_KEY, {
      expiresIn: '4h',
    });

    console.log("Generated Token:", token); // Log the generated token to verify it's correct

    return res.json({ token });
  } catch (error) {
    console.error('Login Error', error);
    return res.status(500).send('Server Error');
  }
};

module.exports = userLogin;
