const express = require('express');
const router = express.Router();
const product = require('../../models/productModel');
const isLoggedin = require('../../middleware/isLoggedin');
const isVerified = require('../../middleware/isVerified');
const isAdmin = require('../../middleware/isAdmin.js')

router.patch('/:id', isLoggedin, isVerified, isAdmin, async (req, res) => {

try {
const { id } = req.params
const { name, price, description, contains, stocksAvailable } = req.body;

const updateProduct = await product.findByIdAndUpdate(
    { _id: id },
    { $set: { name, price, description, contains, stocksAvailable, updatedBy: req.user.email } },
    { new: true, runValidators: true }
  );


if (!updateProduct) {
    return res.status(400).json({ message: 'Product not found.' });
}

res.status(200).json({ message: 'Product updated', product: updateProduct });


} catch (error) {
    
    res.status(500).json({ message: 'Internal Server error, please contact the dev.', error: error.message });

}


});

module.exports = router;