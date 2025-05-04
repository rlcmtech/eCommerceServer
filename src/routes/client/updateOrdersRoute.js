const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const CustBasket = require('../../models/basketModel');
const Product = require('../../models/productModel');

router.put('/', auth, async (req, res) => {
const { orderName, newOrderQuantity } = req.body;

if (!orderName || !newOrderQuantity) {
    return res.status(400).json({ message: "Please update your order to proceed." });
}

const basket = await CustBasket.findOne({ userId: req.user._id });

if (!basket) {
return res.status(404).json({ message:"Basket not found" });
}

// find the item inside the basket array: 

const item = basket.basket.find(item => item.orderName === orderName);

if (!item) {
    return res.status(404).json({ message: "Item not found in the basket" });
}

// update price and total block
item.orderQuantity = newOrderQuantity;
item.totalOrderPrice = item.orderPrice * newOrderQuantity;

// update total price block
basket.totalOrderPrice = basket.basket.reduce((total, item) => total = item.totalOrderPrice, basket.deliveryCharge);

await basket.save();

res.status(200).json({ message: "Your orders have been updated successfully", basket }); 

})

module.exports = router;