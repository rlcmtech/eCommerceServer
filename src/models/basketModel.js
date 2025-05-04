const mongoose = require('mongoose');

const basketItemSchema = new mongoose.Schema({
  orderName: {
    type: String,
    required: true,
  },
  orderQuantity: {
    type: Number,
    required: true,
  },
  orderPrice: {
    type: Number,
    required: true,
  },
  totalOrderPrice: {
    type: Number,
    required: true,
  },
  orderStatus: { 
    type: String,
    enum: ['pending', 'paid', 'processing', 'completed', 'canceled', 'refunded', 'others'],
    default: 'pending',
  },
  remarks: {
  type: String,
  required: false }
}, { id: false });

const custBasketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
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
