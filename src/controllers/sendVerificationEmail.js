const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const user = require('../models/userModel');

const jwtSecret = process.env.JWT_SECRET