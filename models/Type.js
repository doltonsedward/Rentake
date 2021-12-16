const mongoose = require('mongoose')
const { Schema } = mongoose

const typeSchema = new Schema({
    type_name: String,
})

const Type = mongoose.model('type', typeSchema)

module.exports = Type