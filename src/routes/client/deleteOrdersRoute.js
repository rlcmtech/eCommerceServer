const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const CustBasket = require('../../models/basketModel');
const Product = require('../../models/productModel');

router.delete('/', auth, async (req, res) => {
const { orderName } = req.body


if (!orderName) {
return res.status(400).json({ message:"Order name is required." });
}

const basket = await CustBasket.findOne({ userId: req.user._id });

if (!basket) {
    return res(404).json({ message: "Basket not found." });
}

// filter the item to be deleted
const updateBasketItems = basket.basket.filter(item => item.orderName !== orderName);


// check if the item is removed
if (updatedBasketItems.length === basket.basket.length) {
    return res.status(404).json({ message: "Item not found in the basket" });
}

basket.basket = updateBasketItems;

// recalculate the prices after deletion
basket.totalPrice = updatedBasketItems.reduce((total, item) => total + item.totalOrderPrice, basket.deliveryCharge);

await basket.save();

res.status(200).json({ message: "item deleted successfully." })


}); 

module.exports = router;