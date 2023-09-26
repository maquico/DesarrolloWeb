const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    password: 'Angelito.27!_MySQL',
    database: 'Northwind',
    user: 'root'
});

module.exports = connection;

