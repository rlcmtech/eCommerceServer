const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {

try {
 const { isAdmin, firstName, lastName, email, isVerified, password, number, address } = req.body;

 if ( !firstName || !lastName || !email || !number || password || !address ) { 
    return res.status(400).json({ message: "Please complete your profile details."})
 }

const { street, brgy, city, province } = address;

if (!street || !brgy || !city || !province ) {
    return res.status(400).json({message: "Please complete your address information."})
}




 const newUser = new User({ isAdmin, firstName, lastName, email, number, address: { street, brgy, city, province},
 })

await newUser.save();
res.status(201).json({ message: "Account successfully created." });

} catch (error) {
console.error("Error in creating an account", error);
res.status(500).json({ message: "Error in creating an account", error: error.message });
}    
});

module.exports = router;