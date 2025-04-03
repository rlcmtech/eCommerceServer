const express = require('express');
const router = express.Router();

const signup = require('./routes/client/signUpRoute');
const login = require('./routes/loginRoute');
const auth = require('./middleware/auth')
const adminAuth = require('././middleware/adminAuth.js')
const addProduct = require('./routes/admin/addProductRoute.js')


router.use('/signup', signup);

router.use('/login', login)
router.use('/admin/products', auth, adminAuth, addProduct);



module.exports = router;