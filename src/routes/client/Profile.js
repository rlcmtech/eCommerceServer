const express = require('express');
const router = express.Router();
const isLoggedin = require('../../middleware/isLoggedin');
const isVerified = require('../../middleware/isVerified');

router.get('/', isLoggedin, isVerified, (req, res) => {
  res.send('This is the profile page of the customer');
});

module.exports = router;