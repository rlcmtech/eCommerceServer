const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const CustBasket = require('../../models/basketModel');
const Product = require('../../models/productModel');

router.delete('/', auth, async (req, res) => {
    const { orderName } = req.body;
  
    if (!orderName) {
      return res.status(400).json({ message: "Order name is required." });
    }
  
    const basket = await CustBasket.findOne({ userId: req.user.userId });
  
    if (!basket) {
      return res.status(404).json({ message: "Basket not found." });
    }
  
    // Corrected variable name (consistent)
    const updatedBasketItems = basket.basket.filter(item => item.orderName !== orderName);
  
    if (updatedBasketItems.length === basket.basket.length) {
      return res.status(404).json({ message: "Item not found in the basket." });
    }
  
    basket.basket = updatedBasketItems;
  
    // Recalculate total price
    basket.totalPrice = updatedBasketItems.reduce((total, item) => total + item.totalOrderPrice, basket.deliveryCharge);
  
    await basket.save();
  
    res.status(200).json({ message: "Item deleted successfully.", basket });
  });
   

module.exports = router;