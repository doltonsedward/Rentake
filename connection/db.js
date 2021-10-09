const mysql = require('mysql2')

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: null,
    database: 'db_ticket',
    connectionLimit: 5
})

module.exports = connectionPool