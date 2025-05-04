const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const CustBasket = require('../../models/basketModel');
const Product = require('../../models/productModel');

router.get('/', auth, async (req, res) => {

try {
const basket = await CustBasket.findOne({ userId: req.user._id });

if (!basket) {
return res.status(404).json({ message: "Basket not found" });
}

res.status(200).json(basket);

} catch (error) {
console.error(error);
res.status(500).json({ message:"Server error, cannot load this dat at this moment." });

}

});

module.exports = router;