require('dotenv').config();
const express = require('express');
const cors = require('cors');
const formidable = require('formidable');
const s3SDK = require('./s3SDK');
const fs = require('fs');
const app = express();
const { Pool } = require('pg');
const redis = require('redis');
const host = process.env.HOST;
const port = process.env.PORT;

const pool = new Pool({
  connectionString: `postgresql://${process.env.PGHOST}/${process.env.PGDATABASE}`,
});

const redisClient = redis.createClient({
  port: process.env.REDISPORT,
  host,
});

app.use(cors());

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

function storeFileInTardigrade(req, key, next) {
  const form = formidable({ multiples: true });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        next(err);
        return;
      }

      const { type, path } = files.selectedFile.toJSON();

      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: String(key),
        ContentType: type,
        Body: fs.createReadStream(path),
      };

      const uploadConfirmation = await s3SDK.upload(params).promise();
      resolve(uploadConfirmation);
    });
  });
}

async function incrementUploadCountInPostgres(next) {
  const client = await pool.connect();
  const statement = `UPDATE metrics SET total_upload_count = total_upload_count + 1 WHERE id = 1`;

  return new Promise(async (resolve, reject) => {
    try {
      await client.query(statement);
      resolve();
    } catch (error) {
      next(error);
    } finally {
      client.release();
    }
  });
}

async function addEventToRedis(id, event, file, next) {
  try {
    const currentDate = new Date().toUTCString();
    const key = currentDate + '_ID_' + id;
    const value = JSON.stringify({ ...file, event });
    return redisClient.set(key, value);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function storeDataInPostgres(query, next) {
  const dateOfExpiration = new Date(
    Date.now() + Number(query.expirationHours) * 3600 * 1000
  ).toUTCString();
  const client = await pool.connect();

  return new Promise(async (resolve, reject) => {
    try {
      const statement = `INSERT INTO "files" (name, type, max_download_count, download_count, expiration) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const res = await client.query(statement, [
        query.fileName,
        query.fileType,
        query.maxDownloads,
        query.maxDownloads,
        dateOfExpiration,
      ]);
      resolve(res.rows[0]);
    } catch (error) {
      next(error);
    } finally {
      client.release();
    }
  });
}

app.post('/', async (req, res, next) => {
  try {
    const tuple = await storeDataInPostgres(req.query, next);
    await storeFileInTardigrade(req, tuple.id, next);
    await addEventToRedis(tuple.id, 'File uploaded', tuple, next);
    await incrementUploadCountInPostgres(next);
    res.set('Content-Type', 'application/json');
    console.log(tuple);
    return res.status(200).send(JSON.stringify(tuple));
  } catch (err) {
    console.log(err.stack);
    next(err);
  }
});

// 404
app.use(function (req, res, next) {
  return res.status(404).send({ message: 'Route ' + req.url + ' Not found.' });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});

app.listen(port, host, () => {
  console.log(`\nUpload server is now available at http://${host}:${port}.`);
  console.log('Control + C to quit.');
});
