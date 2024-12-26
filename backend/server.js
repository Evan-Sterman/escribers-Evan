// Import required modules
const express = require('express'); // Framework for building web applications
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'); // AWS S3 client and command for uploading objects
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner'); // Utility for generating pre-signed URLs
const cors = require('cors'); // Middleware for enabling CORS
require('dotenv').config(); // Loads environment variables from .env file

// Initialize the Express application
const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Debug log to confirm the AWS region is loaded from the environment
console.log("AWS Region:", process.env.AWS_REGION);

// Create an S3 client instance with credentials and region from .env file
const s3Client = new S3Client({
    region: process.env.AWS_REGION, // AWS region for the S3 bucket
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS access key ID from .env
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY // AWS secret access key from .env
    }
});

// API endpoint to generate a pre-signed URL for uploading a file to S3
app.get('/generate-presigned-url', async (req, res) => {
    // Determine the file type and assign the corresponding MIME type
    const fileType = req.query.fileType === 'json' ? 'json' : 'sfdt'; // Default to 'sfdt' if fileType is not 'json'
    const fileName = `${req.query.fileName}.${fileType}`; // Construct the full file name with extension
    const contentType = fileType === 'json' ? 'application/json' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // Parameters for the S3 PutObject command
    const params = {
        Bucket: process.env.S3_BUCKET_NAME, // Bucket name from .env file
        Key: fileName, // Full file name (with extension)
        ContentType: contentType // MIME type for the file
    };

    try {
        // Log the request parameters for debugging
        console.log('Request Params:', params);

        // Create a PutObject command with the specified parameters
        const command = new PutObjectCommand(params);

        // Generate a pre-signed URL for the command, valid for 60 seconds
        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

        // Log the generated URL for debugging
        console.log('Generated URL:', url);

        // Respond with the generated pre-signed URL
        res.json({ url });
    } catch (err) {
        // Log any errors that occur during URL generation
        console.error('Error generating pre-signed URL:', err);

        // Respond with a 500 status and the error message
        res.status(500).json({ error: err.message });
    }
});

// Start the Express server on port 3002
app.listen(3002, () => {
    console.log('Server running on port 3002');
});

