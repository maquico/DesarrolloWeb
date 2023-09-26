const db = require('./db');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('nuevaNovia.ejs');
  }
);

app.post('/crearNovia', (req, res) => {
    const { nombres, apellidos, telefono, direccion } = req.body;
    
    const insertQuery = 'CALL InsertNovia(?, ?, ?, ?)';
    db.query(insertQuery, [nombres, apellidos, telefono, direccion], (err) => {
      if (err) {
        console.error('Error creando novia:', err);
        res.status(500).send('Error creando novia');
      } else {
        console.log('Novia creada exitosamente');
        res.redirect('/'); // Redirect to the home page or another appropriate route
      }
    });
  });

  app.get('/busquedaNovia', (req, res) => { 
    res.render('busquedaNovia.ejs');
  });
  
  app.get('/buscarNovia', (req, res) => {
    const { criterio } = req.query;

    const searchQuery = 'CALL getNovias(?)';
    db.query(searchQuery, [criterio], (err, results) => {
        if (err) {
            console.error('Error buscando novias:', err);
            res.status(500).send('Error buscando novias');
        } else {
            const novias = results[0];
            console.log(results)
            console.log('-------------------')
            console.log(novias)
            res.render('resultado.ejs', { novias }); // Render the 'buscar-novia' template with search results
        }
    });
});

  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});