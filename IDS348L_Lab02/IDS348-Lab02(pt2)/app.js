const express = require('express');
const connection = require('./db');
const bodyParser = require('body-parser');
const util = require('util');

const app = express();
const queryAsync = util.promisify(connection.query).bind(connection);


app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const query = 'SELECT id, nombre FROM candidatos';

  connection.query(query, (err, results) => {
    if (err) throw err;
    res.render('index', { candidatos: results });
  });
});

app.post('/votar', (req, res) => {
    const candidatoId = Number(req.body.candidatoId);
    const query = `CALL registrarVoto(${candidatoId})`;
  
    connection.query(query, (err) => {
      if (err) throw err;
      res.redirect(`/resultados/${candidatoId}`); // Redirige a la página de resultados
    });
  });

  app.get('/resultados/:candidatoId', async (req, res) => {
    const candidatoId = Number(req.params.candidatoId);
    console.log(typeof candidatoId);
    const query = `CALL obtenerVotos(${candidatoId})`;
  
    try {
      const results = await queryAsync(query);
      const candidato = results[0][0];
      console.log('Results:', results);
  
      if (!results[0]) {
        return res.send('No se encontro el candidato');
      }
      else{
        res.render('resultados', { candidato: candidato});
      }
    } catch (err) {
      return res.send('Hubo un error al obtener los resultados');
    }
  });
  

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
