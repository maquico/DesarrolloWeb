const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db'); // Import the connection from db.js

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    // Serve the HTML form
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/registrar', async (req, res) => {
    const params = {
        tipoDocumento: parseInt(req.body.tipoDocumento),
        documento: req.body.documento,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        fechaNacimiento: req.body.fechaNacimiento,
        notaMedica: req.body.notaMedica,
        montoPagado: parseFloat(req.body.montoPagado)
    };

    try {
        // Call the stored procedure without the OUT parameters
        await registerPerson(connection, params);

        // Retrieve the calculated values using separate queries
        const [totalPersonsResult] = await connection.promise().query('SELECT COUNT(*) AS p_totalPersons FROM tblPersona');
        const [totalAmountResult] = await connection.promise().query('SELECT SUM(montoPagado) AS p_totalAmount FROM tblPersona');

        const p_totalPersons = totalPersonsResult[0].p_totalPersons;
        const p_totalAmount = totalAmountResult[0].p_totalAmount;

        res.send(`Registro exitoso! Total Personas: ${p_totalPersons}, Total Recaudado: ${p_totalAmount}`);
    } catch (error) {
        console.error('Error procesando registro:', error);
        res.status(500).send('Error procesando registro');
    }
});


async function registerPerson(connection, params) {
    const query = 'CALL sp_agregarPersona(?, ?, ?, ?, ?, ?, ?)';
    const [results] = await connection.promise().query(query, [
        params.tipoDocumento,
        params.documento,
        params.nombres,
        params.apellidos,
        params.fechaNacimiento,
        params.notaMedica,
        params.montoPagado
    ]);

    return results;
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

