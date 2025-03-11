const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

app.use(router)

mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('Successfully connected to MongoDB'))
.catch((err) => console.error("Error connected to MongoDB", err));

app.listen(8001, () => console.log(`Server running on Port 8001`));