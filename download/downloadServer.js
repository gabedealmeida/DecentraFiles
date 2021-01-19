require('dotenv').config();
const express = require('express');
const cors = require('cors');
const s3SDK = require('./s3SDK');
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

redisClient.on('error', function (error) {
  console.error(error);
});

async function retrieveTardigradeUrl(Key) {
  const params = { Bucket: process.env.S3_BUCKET, Key, Expires: 15 };
  const signedUrl = await s3SDK.getSignedUrlPromise('getObject', params);
  return signedUrl;
}

async function incrementDownloadCountInPostgres(next) {
  const client = await pool.connect();
  const statement = `UPDATE metrics SET total_download_count = total_download_count + 1 WHERE id = 1`;

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

app.get('/', async (req, res, next) => {
  const { limit, offset } = req.query;
  const currentDate = new Date().toUTCString();
  const client = await pool.connect();

  try {
    const statement = `SELECT * FROM "files" WHERE download_count >= 1 AND expiration > $1::timestamptz ORDER BY expiration ASC LIMIT $2 OFFSET $3`;
    const tuples = await client.query(statement, [currentDate, limit, offset]);
    res.set('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(tuples.rows));
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    client.release();
  }
});

app.get('/totalnumberoffiles', async (req, res, next) => {
  const currentDate = new Date().toUTCString();
  const client = await pool.connect();

  try {
    const statement = `SELECT count(id) FROM "files" WHERE download_count >= 1 AND expiration > $1::timestamptz`;
    const tuples = await client.query(statement, [currentDate]);
    res.set('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(tuples.rows[0]));
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    client.release();
  }
});

app.get('/download', async (req, res, next) => {
  const { id } = req.query;
  const currentDate = new Date().toUTCString();
  const client = await pool.connect();
  const statement = `UPDATE "files" SET download_count = download_count - 1 WHERE id = $1 AND expiration > $2::timestamptz AND download_count > 0 RETURNING *`;

  try {
    // Decrement download count
    const result = await client.query(statement, [id, currentDate]);
    const tuple = result.rows;

    // If the download count is at zero or file has expired return 404
    if (tuple.length === 0) {
      res.set('Content-Type', 'application/json');
      return res.status(404).send(
        JSON.stringify({
          error: 'File has either expired or has reached maximum downloads.',
        })
      );
    }

    const presignedUrl = await retrieveTardigradeUrl(id);

    // Increment download count if Tardigrade does not return a presignedUrl
    if (!presignedUrl) {
      const incrementStatement = `UPDATE "files" SET download_count = download_count + 1 WHERE id = $1`;
      await client.query(incrementStatement, [id]);
      res.set('Content-Type', 'application/json');
      return res.status(404).send(
        JSON.stringify({
          error: 'File was not able to be retrieved from Tardigrad.',
        })
      );
    }

    await incrementDownloadCountInPostgres(next);
    await addEventToRedis(id, 'File downloaded', tuple[0], next);

    res.set('Content-Type', 'application/json');
    return res
      .status(200)
      .send(JSON.stringify({ url: presignedUrl, file: tuple[0] }));
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    client.release();
  }

  // Option to use Postgres transaction with table/row locking
  // `BEGIN;
  // LOCK TABLE "files" IN ROW EXCLUSIVE MODE;
  // DO
  // $$
  // DECLARE
  // file record;
  // BEGIN
  // SELECT * INTO file FROM "files" WHERE id = 201 AND download_count > 0 AND expiration > 'Mon, 18 Jan 2021 21:45:51 GMT'::timestamptz;
  // if file IS NOT NULL THEN
  // UPDATE "files" SET download_count = download_count - 1 WHERE id = 21;
  // END IF;
  // END;
  // $$;
  // COMMIT;
  // `
});

app.get('/metrics', async (req, res, next) => {
  const client = await pool.connect();
  const statement = `SELECT * FROM metrics where id = 1`;

  try {
    const tuples = await client.query(statement);
    res.set('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(tuples.rows[0]));
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    client.release();
  }
});

// Endpoint for retrieving a single file should we ever need it
// app.get('/singlefile', async (req, res) => {
//   const { id } = req.query;
//   const client = await pool.connect();
//   const statement = `SELECT * FROM "files" where id = $1`;

//   try {
//     const tuples = await client.query(statement, [id]);
//     res.set('Content-Type', 'application/json');
//     return res.status(200).send(JSON.stringify(tuples.rows[0]));
//   } catch (error) {
//     console.log(error);
//     next(error);
//   } finally {
//     client.release();
//   }
// });

// 404
app.use(function (req, res, next) {
  return res.status(404).send({ message: 'Route ' + req.url + ' Not found.' });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});

app.listen(port, host, () => {
  console.log(`\nDownload server is now available at http://${host}:${port}.`);
  console.log('Control + C to quit.');
});
