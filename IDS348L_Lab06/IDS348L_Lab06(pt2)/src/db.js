const mysql = require('mysql2')
const dotenv = require('dotenv')

dotenv.config()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Angelito.27!_MySQL',
    database: 'db_Lab06'// Add this line to specify the database
})

module.exports = connection
