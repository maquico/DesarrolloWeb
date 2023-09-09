const express = require('express');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// Configure express-session
app.use(session({
  secret: 'your-secret-key', // Replace with a secure secret key
  resave: false,
  saveUninitialized: true,
}));

// Store online users in the application variable
app.locals.onlineUsers = new Set();

app.get('/', (req, res) => {
  // Get the session ID or create a new one
  const sessionId = req.session.id;

  // Add the session ID to the onlineUsers Set
  app.locals.onlineUsers.add(sessionId);

  res.send(`
    <h1>Online Users: ${app.locals.onlineUsers.size}</h1>
    <a href="/logout">Logout</a>
  `);
});

app.get('/logout', (req, res) => {
  // Remove the session ID from the onlineUsers Set
  app.locals.onlineUsers.delete(req.session.id);

  // Destroy the session
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
