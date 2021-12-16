const mongoose = require('mongoose')
const { Schema } = mongoose

const movieSchema = new Schema({
    type_id: Number,
    movie_name: Number,
    movie_hour: Number,
    image: String,
    Description: String,
})

const Movie = mongoose.model('movies', movieSchema)

module.exports = Movie