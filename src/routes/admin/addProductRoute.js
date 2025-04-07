const express = require('express');
const router = express.Router();
const Product = require('../../models/productModel.js');
const auth = require('../../middleware/auth');

router.post('/', auth, async(req, res) => {
   
try {

const { name, price, description, contains, stocksAvailable } = req.body;

if ( !name || price === undefined || !description || !contains || !stocksAvailable ) {
    return res.status(400).json({ message: "Please complete product information" })
}
const existingProduct = await Product.findOne({ name });
if (existingProduct) {
   return res.status(400).json({ message: "This product is already listed. Please change product name and details." })
}

const newProduct = new Product({ name, price, description, contains, stocksAvailable, addedBy: req.user.email }); await newProduct.save();

res.status(201).json({ message: "New Product successfully added" })


 } catch (error) {
console.error("Error in adding product", error);
res.status(500).json({ message: "Error adding product. Kindly check the server.", error: error.message})


}


});

module.exports = router