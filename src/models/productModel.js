const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

name: {
   type: String,
   required: true,
},

price: {
    type: Number, 
    required: true,
},
description: { 
    type: String,
    required: true,
},

contains: {
type: String,
required: true,
}, 

stocksAvailable: {
    type: Number, 
    default: 10,
    required: true,
},

addedBy: {
    type: String, 
    default: "System",
  
   
},

updatedBy: {
    type: String, 
    default: "System",
  
   
}

}, { timestamps: true, versionKey: false });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;