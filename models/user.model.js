const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username name is required!!'],
    trim: true,
    unique: true,
    minLength: 3,
    maxLength: 25,
  },
  firstName: {
    type: String,
    required: [true, 'firstName is required!!'],
    trim: true,
    minLength: 3,
    maxLength: 25,
  },
  lastName: {
    type: String,
    required: [true, 'LastName is required!!'],
    trim: true,
    minLength: 3,
    maxLength: 25,
  },
  email: {
    type: String,
    required: [true, 'email is required!!'],
    unique: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: [true, 'password is required!!'],
    minLength: 8,

  },
  country: {
    type: String,
    required: [true, 'country is required!!'],
    minLength: 3,
  },
  birthday: { type: Date, default: Date.now() },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);



