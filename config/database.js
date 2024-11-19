const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

client.connect()
  .then(() => {
    console.log('Connected to PostgreSQL');
    return client.query('SELECT NOW()');  // Query untuk memverifikasi akses
  })
  .then((res) => {
    console.log('Database Time:', res.rows[0]);
  })
  .catch((err) => {
    console.error('Connection error', err.stack);
  });


module.exports = client;
