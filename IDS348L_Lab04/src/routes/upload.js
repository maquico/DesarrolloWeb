const axios = require('axios');
const express = require('express');
const multer = require('multer');
const { rekognition } = require('../aws'); // Adjust the import path
const router = express.Router();
const upload = multer({ dest: 'uploads/' });


// ... other code ...

router.post('/', upload.single('files'), async (req, res) => {
    try {
        const imagePath = req.file.path;

        // Detect text using AWS Rekognition
        const params = {
            Image: {
                Bytes: require('fs').readFileSync(imagePath)
            }
        };

        const result = await rekognition.detectText(params).promise();
        const detectedText = result.TextDetections.map(textDetection => textDetection.DetectedText);

        const regexPattern = /\b\d{3}-\d{7}-\d{1}\b/; // Regular expression for the specified format
        const extractedNumbers = detectedText
            .map(text => text.match(regexPattern))
            .filter(match => match)
            .map(match => match[0])
            .map(number => Number(number.replace(/-/g, ''))); // Convert to number

        // Log the extracted numbers
        console.log('Extracted Numbers:', extractedNumbers);

        // Remove duplicates using Set
        const uniqueNumbers = [...new Set(extractedNumbers)];

      // Now call the API and retrieve data for each extracted number
      const apiBaseUrl = 'https://compulaboratoriomendez.com/lib/';
      const apiKey = 'DESARROLLOWEB';

      const peopleData = [];
      const uniqueNumbersA = uniqueNumbers.map(number => Number(number));
      const CED = uniqueNumbersA[0] + uniqueNumbersA[1] + uniqueNumbersA[2];
      const SEQ = uniqueNumbersA[3] + uniqueNumbersA[4] + uniqueNumbersA[5] + uniqueNumbersA[6] + uniqueNumbersA[7] + uniqueNumbersA[8] + uniqueNumbersA[9];
    const VER = uniqueNumbersA[10];
     
          const apiUrl = `${apiBaseUrl}?Key=${apiKey}&MUN_CED=${CED}&SEQ_CED=${SEQ}&VER_CED=${VER}`;
          
          console.log('API URL:', apiUrl); // Debugging output
          
          try {
              const response = await axios.get(apiUrl);
              
              console.log('Response Data:', response.data); // Debugging output
              
              if (response.data && Array.isArray(response.data)) {
                  // Assuming the response data is an array of objects
                  peopleData.push(...response.data);
              } else {
                  console.error('API Response is Empty or Invalid');
              }
          } catch (requestError) {
              console.error('API Request Error:', requestError);
          }
      
      res.json(peopleData);
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
  }
});

module.exports = router;
