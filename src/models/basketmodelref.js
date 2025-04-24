const mongoose = require('mongoose');

// Define the basketItemSchema first
const basketItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  itemQuantity: {
    type: Number,
    required: true,
  },
  pricePerItem: {
    type: Number,
    required: true,
  },
  totalItemPrice: {
    type: Number,
    required: true,
  },
}, { _id: false }); // Optional: prevents _id generation for each item

// Then define the main schema using the basketItemSchema
const custBasketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  basket: [basketItemSchema],
  deliveryCharge: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const CustBasket = mongoose.model('CustBasket', custBasketSchema);

module.exports = CustBasket;
