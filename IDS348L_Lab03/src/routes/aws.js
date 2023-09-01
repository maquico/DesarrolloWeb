const AWS = require('aws-sdk');

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

module.exports = { detectFaces };
