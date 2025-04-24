
const mongoose = require('mongoose');

const basketItemSchema = new mongoose.Schema({
productName: {
  type: String,
  require: true,
}, 
productQuantity: {
Type: String,
require: true,
}, 
itemPrice: {
  Type: String, 
  required: true,
}, 
totalProductPrice: {
  type: Number, 
  required: true,
}, 
}, { id: false })

const custBasketSchema = new mongoose.Schema({
userId: { 
type: mongoose.Schema.Types.ObjectId,
required: true,
ref: "User",
}, 

basket: [ basketItemSchema ],
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
module.export = CustBasket;
