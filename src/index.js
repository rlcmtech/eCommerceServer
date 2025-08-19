const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // React frontend
  credentials: true,               // allow cookies
}));
app.use(morgan('tiny'));

// Routes
app.use(router);

// MongoDB Connection and Server Start
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');

    const PORT = process.env.PORT || 8001;
    app.listen(PORT, () => console.log(`🚀 Server running on Port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
