const express = require('express');
const router = express.Router();

const signup = require('./routes/client/signUpRoute');
const login = require('./routes/loginRoute');
const auth = require('./middleware/auth');
const adminAuth = require('././middleware/adminAuth.js');

const addProduct = require('./routes/admin/addProductRoute.js');
const editProduct = require('./routes/admin/editProductRoute.js');
const deleteProduct = require('./routes/admin/deleteProductRoute.js');
const displayProducts = require('./routes/admin/displayProductsRoute.js');

const addOrder = require('./routes/client/addOrdersRoute');


router.use('/signup', signup);

router.use('/login', login)
router.use('/admin/products', auth, adminAuth, addProduct);
router.use('/admin/products', auth, adminAuth, editProduct);
router.use('/admin/products', auth, adminAuth, deleteProduct);
router.use('/admin/products', auth, adminAuth, displayProducts);

router.use('/customer/basket/addproduct', auth, addOrder )


module.exports = router;