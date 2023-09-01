const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1' // Change this to your desired region
});

const rekognition = new AWS.Rekognition();

module.exports = {
    rekognition // Export the configured Rekognition instance
};
