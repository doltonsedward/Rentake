const mongoose = require('mongoose')
const { Schema } = mongoose

const ticketSchema = new Schema({
    movie_id: Number,
    user_id: Number,
    ticket_number: Number,
    date_show: Date,
    time_show: String,
    price: Number,
    venue: String,
})

const Ticket = mongoose.model('tickets', ticketSchema)

module.exports = Ticket