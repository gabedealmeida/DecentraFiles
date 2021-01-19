require('dotenv').config()
const AWS = require('aws-sdk');

const s3SDK = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESSKEYID,
  secretAccessKey: process.env.S3_SECRETACCESSKEY,
});

module.exports = s3SDK;
