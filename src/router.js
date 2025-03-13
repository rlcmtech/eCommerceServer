const express = require('express');
const router = express.Router();

const signup = require('./routes/client/signUpRoute');




router.use('/signup', signup);

module.exports = router;