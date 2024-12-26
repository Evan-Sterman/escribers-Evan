import AWS from 'aws-sdk';

// Configure the AWS SDK with credentials and region from environment variables
AWS.config.update({
    accessKeyId: 'accesskey', // Replace with your access key ID
    secretAccessKey: 'secretaccesskey', // Replace with your secret access key
    region: 'region' // Replace with your bucket's region
});

const s3 = new AWS.S3(); // Create S3 service object

export default s3; // Export the configured S3 object

