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
    pass: process.env.EMAIL_PASS,
},
});

router.post('/', async (req, res) => {

try {

const { email } = req.body;   
const user = await User.findOne({ email });


if (!user) {
    return res.status(404).json({ message: "User is not found from the database" })
}

const resetPasswordToken = jwt.sign(
    { userId: user._id },
    jwtSecret,
    { expiresIn: '30m' }
);

// View the token in terminal for testing
console.log('Reset Token:', resetPasswordToken);





const resetPasswordURL = `${FEresetPasswordURL}?token=${resetPasswordToken}`

const mailOptions = {
from: process.env.EMAIL_USER,
to: user.email,
subject: 'Reset your password',
html: `
    <p>Hello ${user.firstName} ${user.lastName},</p>
        <p>Click the link below to reset your password. This link will expire in 30 minutes:</p>
        <a href="${resetPasswordURL}">${resetPasswordURL}</a>
      `
    };

await transporter.sendMail(mailOptions);

res.json ({ message: 'Reset email was send. Please check your email. If it is not in your inbox, please check your spam' })


} catch (error) {
console.error('error in sending reset password email', error);
res.status(500).json({ message: 'internal server error, please contact the dev.' })    
  
}

});

module.exports = router;

