const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is empty"]
  },
  password: {
    type: String,
    required: [true, "password is empty"]
  },
})

const User = mongoose.model('User', userSchema)
module.exports = User;