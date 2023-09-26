const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Angelito.27!_MySQL',
    database: 'db_Lab07'
});

connection.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err);
    } else {
      console.log('Connected to the database');
    }
  });
  
  module.exports = connection;