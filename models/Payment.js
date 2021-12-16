const mongoose = require('mongoose')
const { Schema } = mongoose

const paymentSchema = new Schema({
    ticket_id: Number,
    amount: Number,
    sub_total: Number,
})

const Payment = mongoose.model('payments', paymentSchema)

module.exports = Payment