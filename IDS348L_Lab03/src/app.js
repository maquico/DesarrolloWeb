const express = require('express');
const app = express();
const uploadRouter = require('./routes/upload');


// Middleware to handle JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Use the upload router
app.use('/upload', uploadRouter);



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
