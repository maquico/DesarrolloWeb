const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Import the database connection
const connection = require('./db');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static(__dirname + '/'));

// Serve 'index.html' as the initial page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/agregar', (req, res) => {
  res.render('agregarPersona'); // Render the EJS view for the registration form
});

app.post('/agregar', (req, res) => {
  const { Nombres, Apellidos, VaAllevar } = req.body;
  const persona = { Nombres, Apellidos, VaAllevar };

  const sql = 'INSERT INTO tblPersona SET ?';

  connection.query(sql, persona, (err, result) => {
    if (err) throw err;
    console.log('Persona registrada correctamente');
    res.redirect('/listaPersonas'); // Redirect to the 'listaPersonas' route
  });
});

app.get('/listaPersonas', (req, res) => {
  // Implement code to fetch and display the list of people from the database
  // This would typically involve a MySQL query to retrieve data
  const sql = 'SELECT * FROM tblPersona';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    const personas = result;
    res.render('listaPersonas', { personas }); // Render the EJS view with data
  });
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
