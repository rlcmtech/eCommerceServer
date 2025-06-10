const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/userModel');

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

// get the token 
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token was provided. Cannot reset the password."  });
}

const loginToken = authHeader.split(' ')[1];

// verify the token


let decoded;
try { 
    decoded = jwt.verify(loginToken, jwtSecret);
} catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
}

// Find the user via userId

const user = await User.findById(decoded.userId);

if (!user) {
    return res.status(404).json({ message: 'User not found' })
}

// If user is not verified, do not process
if (!user.isVerified) {
return res.status(403).json({ message: 'Please verify your email before changing the password.' })    
}

// Generate a token for reset password: --- check schema
const resetToken = jwt.sign(
   { id: user._id },
   jwtSecret,
   { expiresIn: '20m' } 
)

const passwordResetURL = `${FRONTEND_RESET_URL}?token=${resetToken}`



// Send reset password email with the link

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Change Password Email',
    html: `
    Hello ${user.firstName} ${user.lastName} Here is the email to change your password. Please use the link provided to change your password: 
     <a href="${passwordResetURL}">${passwordResetURL}</a>
this email will expire in 20 mins
    `
}

await transporter.sendMail(mailOptions)
res.json({ message: 'Change password email sent' })

// the email will contain a token that will allow the user to change the password. the token is only valid for 20 minutes. 

// basically, this code does not do a change password function but will only trigger a user to receive an email that will nroing them to the change password page (via link)

} catch (error) {
    console.error 
       console.error('Error sending change password email', error);
       res.status(500).json({ message: 'Internal Server error, please contact your devs' }); 
}

});

module.exports = router;

