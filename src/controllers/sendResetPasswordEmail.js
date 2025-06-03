const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const user = require('../models/userModel');

const jwtSecret = process.env.JWT_SECRET
const FEresetPasswordURL = process.env.FRONTEND_RESET_URL

const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
},
});

router.get('/', async (req, res) => {

try {

// get the username from the token and match it from the database - use findById method
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token was provided. Cannot reset the password."  });
}

const loginToken = authHeader.split(' ')[1];






// once found, process a sending email using the nodemailer - there are if conditions - only do this is the account is verfied

// the email will contain a token that will allow the user to change the password. the token is only valid for 20 minutes. 

// basically, this code does not do a change password function but will only trigger a user to receive an email that will nroing them to the change password page (via link)

} catch {

}









})