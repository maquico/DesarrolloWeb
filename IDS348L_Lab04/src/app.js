const express = require('express');
const dotenv = require('dotenv');
const db = require('./db');
const uploadRouter = require('./routes/upload');
const { rekognition } = require('./aws'); // Import the rekognition instance

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Use the upload router
app.use('/upload', uploadRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is runninggggg on port ${PORT}`);
});
