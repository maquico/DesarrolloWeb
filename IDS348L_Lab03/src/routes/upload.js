const express = require('express');
const multer = require('multer');
const router = express.Router();
const mysql = require('mysql2');
const db = require('../db');
const AWS = require('aws-sdk');



// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store file data in memory
const upload = multer({ storage }).any();

AWS.config.update({
    accessKeyId: 'AKIAIE5LZMZN4CR6IO5Q',    
    secretAccessKey: 'xUtzMH5IxZmuZYrc9KSN83JE+pgf5J60+FajM65J', // Replace with your AWS Secret Access Key
    region: 'us-east-1'                
});

const rekognition = new AWS.Rekognition();

// Function to perform face detection using Rekognition
const detectFaces = async (imageBuffer) => {
    return new Promise((resolve, reject) => {
        rekognition.detectFaces(
            { Image: { Bytes: imageBuffer } },
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.FaceDetails);
                }
            }
        );
    });
};

router.post('/', upload, async (req, res) => {
  try {
    const files = req.files; // Array of uploaded files

    // Call the DetectFaces operation
    detectedFaces = await detectFaces(files[0].buffer);

    if (detectedFaces.length !== 1) {
      res.status(200).json({ message: 'No face detected' });
      return; // Stop execution
    }

    // Get other form data from req.body
    const {
      tipodocumento,
      nombres,
      fechanacimiento,
      sexo,
      ocupacion,
      salario,
      casa_propia,
      vehiculo,
      estado,
      lugar_trabajo,
      nivel_academico,
    } = req.body;

    // Use the uploaded file name for the foto parameter
    const foto = files[0].originalname;

    // Call the stored procedure to insert data into the database
    db.query(
      'CALL InsertSolicitante(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        tipodocumento,
        nombres,
        fechanacimiento,
        sexo,
        ocupacion,
        salario,
        casa_propia,
        vehiculo,
        estado,
        lugar_trabajo,
        nivel_academico,
        foto,
      ],
      (error, results) => {
        if (error) {
          console.error('Error calling stored procedure:', error);
          res.status(500).json({ message: 'Error calling stored procedure' });
        } else {
          console.log('Stored procedure executed successfully');
          res.status(200).json({ message: 'Stored procedure executed successfully' });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
