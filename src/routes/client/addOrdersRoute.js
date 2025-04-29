const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const CustBasket = require('../../models/basketModel');
const Product = require('../../models/productModel');

router.post ('/', auth, async (req, res) => {

try {
    const { productId, orderQuantity } = req.body;
    
    // search product from DB
const product = await Product.findById(productId);
if (!product) return res.status(404).json({ message: "Product not found in the database." });

    // availability logic - stock < order
if (product.stocksAvailable < orderQuantity) {
return res.status(400).json({ message: "Available stocks are not enough. Please reduce your order for now to continue." })
    
    // availability logic - stock is enough
product.stocksAvailable -= orderQuantity;
await product.save();
}

    // calculate prices
const orderPrice = product.price;
const totalOrderPrice = orderPrice * orderQuantity;

    //
let basket = await CustBasket.findOne({ userId: req.user.id });

if (!basket) {
    basket = new CustBasket({
userId: req.user.id,
basket: [],
deliveryCharge: 50, // this is default
totalPrice: 0
    });
}

    // add item/s to basket
basket.basket.push({
orderName: product.name,
orderQuantity,
orderPrice,
totalOrderPrice,
});

    // update total price
basket.totalPrice += totalOrderPrice;

await basket.save();

res.status(200).json({ message: "Order successfully added to basket.", basket });

} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
}    
});

module.exports = router;