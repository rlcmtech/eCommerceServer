const express = require('express');
const router = express.Router();

const signup = require('./controllers/signUp.js');
const login = require('./controllers/login.js');
const isVerified = require('./middleware/isVerified.js');
const verifyEmail = require('./controllers/verifyEmail.js')
const resetPassword = require('./controllers/resetPassword.js');
const sendResetPasswordEmail = require('./controllers/sendResetPasswordEmail.js');
const sendEmailVerificationEmail = require('./controllers/sendVerificationEmail.js');
const isLoggedin = require('./middleware/isLoggedin.js');
const isAdmin = require('./middleware/isAdmin.js');

const addProduct = require('./routes/admin/addProduct.js');
const updateProduct = require('./routes/admin/updateProduct.js');
const deleteProduct = require('./routes/admin/deleteProduct.js');
const displayProducts = require('./routes/admin/displayProducts.js');

const addOrder = require('./routes/client/addOrders.js');
const updateOrder = require('./routes/client/updateOrders.js');
const deleteOrder = require('./routes/client/deleteOrders.js');
const displayOrder = require('./routes/client/displayOrders.js');

// controllers
router.use('/signup', signup);
router.use('/login', login);
router.use('/user/verify', verifyEmail);
router.use('/user/resetpassword', resetPassword );
router.use('/user/emailrequest/verifyemail', isLoggedin, sendEmailVerificationEmail);
router.use('/user/emailrequest/resetpassword', isLoggedin, sendResetPasswordEmail);

// admin routes
router.use('/admin/products', isLoggedin, isVerified, isAdmin, addProduct);
router.use('/admin/products', isLoggedin, isVerified, isAdmin, updateProduct);
router.use('/admin/products', isLoggedin, isVerified, isAdmin, deleteProduct);
router.use('/admin/products', isLoggedin, isVerified, isAdmin, displayProducts);

// customer routes
router.use('/customer/basket/addorder', isLoggedin, isVerified, addOrder);
router.use('/customer/basket/updateorder', isLoggedin, isVerified, updateOrder);
router.use('/customer/basket/deleteorder', isLoggedin, isVerified, deleteOrder);
router.use('/customer/basket/displayorder', isLoggedin, isVerified, displayOrder);


module.exports = router;