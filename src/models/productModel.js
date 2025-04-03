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
    required: true,
    
},
}, { timestamps: true, versionKey: false });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;