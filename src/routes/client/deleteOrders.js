const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const isLoggedin = require('../../middleware/isLoggedin');
const isVerified = require('../../middleware/isVerified');
const CustBasket = require('../../models/basketModel');

router.delete('/', isLoggedin, isVerified, async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required." });
  }

  const basket = await CustBasket.findOne({ userId: req.user._id });

  if (!basket) {
    return res.status(404).json({ message: "Basket not found." });
  }

  // Use 'new' here to fix ObjectId instantiation error
  const updatedBasketItems = basket.basket.filter(item =>
    !item.productId.equals(new mongoose.Types.ObjectId(productId))
  );

  if (updatedBasketItems.length === basket.basket.length) {
    return res.status(404).json({ message: "Item not found in the basket." });
  }

  basket.basket = updatedBasketItems;

  basket.totalPrice = updatedBasketItems.reduce(
    (total, item) => total + item.totalOrderPrice,
    basket.deliveryCharge
  );

  await basket.save();

  res.status(200).json({ message: "Item deleted successfully.", basket });
});

module.exports = router;
