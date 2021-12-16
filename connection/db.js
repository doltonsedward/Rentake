const mongoose = require('mongoose')

const URL_DB = process.env.URL_MONGODB || process.env.DEV_URL_MONGODB

mongoose.connect(URL_DB)

module.exports = mongoose