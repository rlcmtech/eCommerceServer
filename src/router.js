const express = require('express');
const router = express.Router();

const signup = require('./routes/signUpRoute');
const products = require('./models/addProducModel')



router.use('/', signup);
router.use('/', products)

module.exports = router;