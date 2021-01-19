const express = require('express');
const cors = require('cors');
// const s3SDK = require('./s3SDK');
const app = express();
// const { Pool } = require('pg');
// const redis = require('redis');
const host = process.env.HOST;
const port = process.env.PORT;

// const pool = new Pool({
//   connectionString: `postgresql://${process.env.PGHOST}/${process.env.PGDATABASE}`,
// });

// const redisClient = redis.createClient({
//   port: process.env.REDISPORT,
//   host,
// });

app.use(cors());

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

// Testing functions
function isThisATest() {
  return process.env.NODE_ENV === 'test';
}

function metricsTestObj() {
  return {
    rows: [{ id: 1, total_upload_count: 6, total_download_count: 9 }],
  };
}

function retrieveTestFiles(limit, offset, next) {
  if (!(limit && offset)) {
    next(new Error('All necessary query data are not present.'));
  }

  return {
    rows: [
      {
        created_at: '2021-01-19T17:02:49.878Z',
        download_count: 12,
        expiration: '2021-01-19T18:02:49.000Z',
        id: 85,
        max_download_count: 12,
        name: 'tardigrade1.0',
        type: 'Text',
      },
      {
        created_at: '2021-01-19T03:12:12.470Z',
        download_count: 43,
        expiration: '2021-01-20T02:12:12.000Z',
        id: 74,
        max_download_count: 43,
        name: 'tardigrade1000',
        type: 'Other',
      },
      {
        created_at: '2021-01-19T02:15:39.839Z',
        download_count: 88,
        expiration: '2021-01-20T08:15:39.000Z',
        id: 73,
        max_download_count: 88,
        name: 'Houston1898',
        type: 'Video',
      },
    ],
  };
}

function retrieveFileForDownload(id) {
  if (!id) {
    next(new Error('All necessary query data are not present.'));
  }

  return {
    rows: [
      {
        created_at: '2021-01-19T02:15:39.839Z',
        download_count: 88,
        expiration: '2021-01-20T08:15:39.000Z',
        id: 73,
        max_download_count: 88,
        name: 'Houston1898',
        type: 'Video',
      },
    ],
  };
}

function retrieveTardigradeTestUrl() {
  return 'http://gateway.tardigradeshare.io';
}

function retrieveTotalNumberOfFilesTest() {
  return { rows: [{ count: 5 }] };
}
// End of testing functions

app.get('/', async (req, res, next) => {
  const test = isThisATest();
  const { limit, offset } = req.query;
  const currentDate = new Date().toUTCString();
  // const client = await pool.connect();

  try {
    // const statement = `SELECT * FROM "files" WHERE download_count >= 1 AND expiration > $1::timestamptz ORDER BY expiration ASC LIMIT $2 OFFSET $3`;
    const tuples = test ? retrieveTestFiles(limit, offset, next) : '';
    // const tuples = await client.query(statement, [currentDate, limit, offset]);
    res.set('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(tuples.rows));
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    // client.release();
  }
});

app.get('/totalnumberoffiles', async (req, res, next) => {
  const test = isThisATest();
  const currentDate = new Date().toUTCString();
  // const client = await pool.connect();

  try {
    // const statement = `SELECT count(id) FROM "files" WHERE download_count >= 1 AND expiration > $1::timestamptz`;
    // const tuples = await client.query(statement, [currentDate]);
    const tuples = test ? retrieveTotalNumberOfFilesTest() : '';
    res.set('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(tuples.rows[0]));
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    // client.release();
  }
});

app.get('/download', async (req, res, next) => {
  const test = isThisATest();
  const { id } = req.query;
  const currentDate = new Date().toUTCString();
  // const client = await pool.connect();
  // const statement = `UPDATE "files" SET download_count = download_count - 1 WHERE id = $1 AND expiration > $2::timestamptz AND download_count > 0 RETURNING *`;

  try {
    // Decrement download count
    // const result = await client.query(statement, [id, currentDate]);
    // const tuple = result.rows;
    const tuple = test ? retrieveFileForDownload(id).rows : '';

    // If the download count is at zero or file has expired return 404
    // if (tuple.length === 0) {
    //   res.set('Content-Type', 'application/json');
    //   return res.status(404).send(
    //     JSON.stringify({
    //       error: 'File has either expired or has reached maximum downloads.',
    //     })
    //   );
    // }

    // const presignedUrl = await retrieveTardigradeUrl(id);
    const presignedUrl = test ? retrieveTardigradeTestUrl() : '';

    // Increment download count if Tardigrade does not return a presignedUrl
    // if (!presignedUrl) {
    //   const incrementStatement = `UPDATE "files" SET download_count = download_count + 1 WHERE id = $1`;
    //   await client.query(incrementStatement, [id]);
    //   res.set('Content-Type', 'application/json');
    //   return res.status(404).send(
    //     JSON.stringify({
    //       error: 'File was not able to be retrieved from Tardigrad.',
    //     })
    //   );
    // }

    // await incrementDownloadCountInPostgres(next);
    // await addEventToRedis(id, 'File downloaded', tuple[0], next);
    res.set('Content-Type', 'application/json');
    return res
      .status(200)
      .send(JSON.stringify({ url: presignedUrl, file: tuple[0] }));
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    // client.release();
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

app.get('/metrics', async (req, res, next) => {
  const test = isThisATest();
  const tuples = metricsTestObj();
  // const client = await pool.connect();
  // const statement = `SELECT * FROM metrics where id = 1`;

  try {
    // const tuples = await client.query(statement);
    res.set('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(tuples.rows[0]));
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    // client.release();
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

module.exports = app;
