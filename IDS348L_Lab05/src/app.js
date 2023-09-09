const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const axios = require('axios');
const connection = require('./routes/db');
const generateReport = require('./routes/generate-report');
const cache = require('memory-cache'); // Import memory-cache library
const generateReportAll = require('./routes/generate-report-all');

// Middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/donantes.html");
  });

  
// Function to fetch data with caching
async function fetchDataWithCaching(ced, serie, digitoVerificador) {
  const cacheKey = `${ced}-${serie}-${digitoVerificador}`;
  
  // Check if data is already cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Data found in cache.');
    return cachedData;
  }

  try {
    const response = await axios.get(
      `https://compulaboratoriomendez.com/lib/?Key=DESARROLLOWEB&MUN_CED=${ced}&SEQ_CED=${serie}&VER_CED=${digitoVerificador}`
    );

    // Cache the data for a certain period (e.g., 10 minutes)
    cache.put(cacheKey, response.data, 10 * 60 * 1000); // Cache for 10 minutes

    console.log('Data fetched from the source.');
    return response.data;
  } catch (error) {
    throw error;
  }
}

// ... (previous code)

app.get('/donantes.html', async (req, res) => {
    try {
      const cedula = await fetchDataWithCaching(
        req.query.ced,
        req.query.serie,
        req.query.digitoVerificador
      );
  
      const donante = {
        tipoDocumento: req.query.tipoDocumento,
        cedula: req.query.ced + req.query.serie + req.query.digitoVerificador,
        nombres: cedula[0].NOMBRES,
        apellidos: cedula[0].APELLIDO1 + ' ' + cedula[0].APELLIDO2,
        sexo: cedula[0].SEXO,
        fechaNacimiento: cedula[0].FECHA_NAC,
        tipoSangre: req.query.tipoSangre,
        peso: req.query.peso,
        fechaAlcohol: req.query.ultimoAlcohol,
      };
  
      console.log(donante);
  
      const fechaNacString = donante.fechaNacimiento.toString();
      const fechaNac = new Date(fechaNacString);
      const fechaAlcoholString = donante.fechaAlcohol.toString();
      const fechaAlcohol = new Date(fechaAlcoholString);
  
      connection.query(
        'INSERT INTO tblDonantes (tipoDocumento, documento, nombres, apellidos, fechaNacimiento, sexo, peso, tipoSangre, fechaAlcohol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          donante.tipoDocumento,
          donante.cedula,
          donante.nombres,
          donante.apellidos,
          fechaNac,
          donante.sexo,
          donante.peso,
          donante.tipoSangre,
          fechaAlcohol,
        ],
        (error, results) => {
          if (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({ error: 'Failed to insert data' });
          } else {
            console.log('Data inserted successfully');
            generateReport(donante);
          }
        }
      );
    } catch (error) {
      console.error('Error:', error);
    }
  });

  app.get('/report_all', async (req, res) => {
    try {
    // Fetch all donantes data (you need to implement this)
function selectAllDonantes(callback) {
    const query = `SELECT * FROM tblDonantes`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        callback(err, null); // Pass the error to the callback
      } else {
        console.log('Data fetched successfully');
        console.log(results);
        callback(null, results); // Pass the data to the callback
      }
    });
  }
  
  // Call the selectAllDonantes function
  selectAllDonantes((err, donantes) => {
    if (err) {
      console.error('Error:', err);
    } else {
      // Generate a report for all donantes
      generateReportAll(donantes);
    }
  });
  
  
      // Respond to the client
      res.send('Report generation for all objects triggered successfully.');
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to generate report for all objects' });
    }
  })
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  