import AWS from 'aws-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configure the AWS SDK with credentials and region from environment variables
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Loaded from .env
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Loaded from .env
    region: process.env.AWS_REGION // Loaded from .env
});

const s3 = new AWS.S3(); // Create S3 service object

export default s3; // Export the configured S3 object

