import AWS from 'aws-sdk';

// Configure the AWS SDK with your credentials and region
AWS.config.update({
    accessKeyId: 'AKIAWAA66HS2HCHSLPHZ', // Replace with your access key ID
    secretAccessKey: '8vgmQ7qTk2q1OIarvmWTWbVyN/MCAxry9XN6Vgf8', // Replace with your secret access key
    region: 'us-east-1' // Replace with your bucket's region
});

const s3 = new AWS.S3(); // Create S3 service object

export default s3; // Ensure you are exporting the s3 object as default
