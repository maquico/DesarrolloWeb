const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(express.static('public'));

// Configure your MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Angelito.27!_MySQL',
  database: 'db_Lab09'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error: ' + err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + db.threadId);
});

// Define a secret key for JWT
const jwtSecretKey = 'lab09';

// Define API endpoints for user registration, login, and message posting
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Hash the password before storing it in the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Password hashing error' });
    }

    // Call the CreateUser procedure to insert the user into the database
    db.query('CALL CreateUser(?, ?)', [username, hashedPassword], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'User registration error' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Retrieve the user's hashed password from the database
  db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'User retrieval error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = results[0];

    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, user.password, (err, passwordMatch) => {
      if (err || !passwordMatch) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      // Create and sign a JWT
      const token = jwt.sign({ userId: user.userID, username: user.username }, jwtSecretKey, { expiresIn: '1h' });

      // Send the JWT as a response
      res.status(200).json({ token });
    });
  });
});

app.get('/messages', (req, res) => {
  // Call the ReadAllMessages procedure to retrieve all messages from the database
  db.query('CALL ReadAllMessages()', (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Message retrieval error' });
    }
    res.status(200).json(results[0]);
  });
});

app.post('/messages', (req, res) => {
  const { texto, usuario, cantidadVisitas } = req.body;

  // Call the CreateMessage procedure to insert the message into the database
  db.query('CALL CreateMessage(?, ?, ?)', [texto, usuario, cantidadVisitas], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Message creation error' });
    }
    res.status(201).json({ message: 'Message created successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
