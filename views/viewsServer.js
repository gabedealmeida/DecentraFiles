require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const host = process.env.HOST;
const port = process.env.PORT;

app.use(cors());

app.use(express.static(path.resolve(__dirname + '/public/')));

// 404
app.use(function (req, res, next) {
  return res.status(404).send({ message: 'Route ' + req.url + ' Not found.' });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  return res.status(500).send({ error: err });
});

app.listen(port, host, () => {
  console.log(`\nViews server is now available at http://${host}:${port}.`);
  console.log('Control + C to quit.');
});
