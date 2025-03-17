const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');


const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASS;
const jwtSecret = process.env.JWT_Secret;


router.post('/', async (req, res) => {

try {
 const { isAdmin, firstName, lastName, email, password, number, address, } = req.body;

 if ( !firstName || !lastName || !email || !number || !password || !address ) { 
    return res.status(400).json({ message: "Please complete your profile details."})
 }

const { street, brgy, city, province } = address;

if (!street || !brgy || !city || !province ) {
    return res.status(400).json({message: "Please complete your address information."})
}


// verify if there is an existing user account: 
const existingUser = await User.findOne({ email });
if (existingUser) {
    return res.status(400).json({ message: "Email is already registered. Please use different email." });
}

// Hashing the password: 
const hashedPassword = await bcrypt.hash(password, 10);

//creates a new user:
 const newUser = new User({ isAdmin, firstName, lastName, email, number, address: { street, brgy, city, province}, isVerified: false,
 });

await newUser.save();
res.status(201).json({ message: "Account successfully created." });


// Generates token: 
const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: '1h' });

//verification email: 
const transporter = nodemailer.createTransport({
service: 'gmail',
auth:{
    
}

});








} catch (error) {
console.error("Error in creating an account", error);
res.status(500).json({ message: "Error in creating an account", error: error.message });
}    
});

module.exports = router;