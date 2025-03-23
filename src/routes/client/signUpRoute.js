const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASS;
const jwtSecret = process.env.JWT_SECRET;


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
 const newUser = new User({ isAdmin, firstName, lastName, email, password: hashedPassword, number, address: { street, brgy, city, province}, isVerified: false,
 });

await newUser.save();



// Generates token: 
const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: '1h' });

//verification email: 
const transporter = nodemailer.createTransport({
service: 'gmail',
auth:{
    user: emailUser,
    pass: emailPassword,
}

});

const verificationLink = `http://localhost:8001/verify?token=${token}`; // change this according to production / host

const verificationEmailContent = {
from: emailUser,
to: newUser.email,
Subject: 'Please verify your email', 
html: `
<h1>Verification Link</h1>
<p>Please click the email below to vefivy your email:</p>
<a href = "${verificationLink}">Verification Link</a>

`,
};

// this block sends the email:

await transporter.sendMail(verificationEmailContent)

res.status(201).json({message: 'Account created, Please verify your email. Check your email to access the verification link.'});


} catch (error) {
console.error("Error in creating an account", error);
res.status(500).json({ message: "Error in creating an account", error: error.message });
}    
});

module.exports = router;