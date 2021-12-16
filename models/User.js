const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    fullName: String,
    email: String,
    password: String,
    isAdmin: Boolean
})

const User = mongoose.model('users', userSchema)

module.exports = User