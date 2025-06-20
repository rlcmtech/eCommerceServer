const express = require('express');
const router = express.Router();
const isLoggedin = require('../../middleware/isLoggedin');
const isVerified = require('../../middleware/isVerified');
const CustBasket = require('../../models/basketModel');
const Product = require('../../models/productModel');


router.post('/', isLoggedin, isVerified, async (req, res) => {
  try {
    const { productId, orderQuantity } = req.body;

    // ✅ Ensure userId is available
    if (!req.user || !req.user._id) {  // Change .id to .userId
      return res.status(400).json({ message: "User ID is missing from the request." });
    }

    // ✅ Find product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found in the database." });
    }

    // ✅ Check stock availability
    if (product.stocksAvailable < orderQuantity) {
      return res.status(400).json({
        message: "Available stocks are not enough. Please reduce your order for now to continue."
      });
    }

    // ✅ Deduct stock from available inventory
    product.stocksAvailable -= orderQuantity;
    await product.save();

    // ✅ Calculate prices
    const orderPrice = product.price;
    const totalOrderPrice = orderPrice * orderQuantity;

    // ✅ Find or create basket
    let basket = await CustBasket.findOne({ userId: req.user._id });  // Change .id to .userId

    if (!basket) {
      basket = new CustBasket({
        userId: req.user._id,  // Use userId instead of id
        basket: [],
        deliveryCharge: 50,  // Default delivery charge
        totalPrice: 0
      });
    }

    // ✅ Add order to basket
    basket.basket.push({
      productId: product._id,
      orderName: product.name,
      orderQuantity,
      orderPrice,
      totalOrderPrice,
    });

    // ✅ Update total basket price
    basket.totalPrice += totalOrderPrice;

    // ✅ Save the updated basket
    await basket.save();

    res.status(200).json({ message: "Order successfully added to basket.", basket });

  } catch (error) {
    console.error("Error adding order:", error); // Improved error logging
    res.status(500).json({ message: "Server error.", error: error.message }); // Send actual error message for debugging
  }
});

module.exports = router;
