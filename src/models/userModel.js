const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({  // Added 'new mongoose.Schema'
  isAdmin: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: true, 
  }, 
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
password: {
  type: string,
  required: true,
},
  number: {
    type: Number,
    required: false,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    brgy: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    }, 
    province: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
        default: false, 
    },
  }
}, { timestamps: true, versionKey: false });

const User = mongoose.model('User', userSchema);

module.exports = User;