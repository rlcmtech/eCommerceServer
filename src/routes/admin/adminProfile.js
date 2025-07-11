const express = require('express');
const router = express.Router();
const isLoggedin = require('../../middleware/isLoggedin');
const isVerified = require('../../middleware/isVerified');
const isAdmin = require('../../middleware/isAdmin');

router.get('/', isLoggedin, isVerified, isAdmin, (req, res) => {
  res.send('This is the profile page of the admin');
});

module.exports = router;