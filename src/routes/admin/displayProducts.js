const express = require('express');
const router = express.Router();
const Product = require('../../models/productModel.js');
const isLoggedin = require('../../middleware/isLoggedin');
const isVerified = require('../../middleware/isVerified');
const isAdmin = require('../../middleware/isAdmin.js')

router.get('/', isLoggedin, isVerified, isAdmin, async (req, res) => {

try {

// track via console log
console.log('User:', req.user.email);

const displayProducts = await Product.find({});

if (!displayProducts.length) {
 return res.status(400).json({ message: 'No products found' })   
 }

 res.status(200).json(displayProducts);



} catch (error) { 
    console.error('Error fetching products:', error);
res.status(500).json({ message: 'Server erro, please contacct dev', error: error.message });
}

});

module.exports = router;

