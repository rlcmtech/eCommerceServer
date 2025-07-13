const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const userLogout = async (req, res) => {
res.send("You log out")

}

module.exports = userLogout