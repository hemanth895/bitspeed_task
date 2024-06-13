const { Pool } = require('pg');


//const pool = new Pool({
//  user: 'postgres',
//  host: '127.0.0.1',
//  database: 'bitspeed_db',
//  password: 'root',
//  port: 5432,
//});


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});



export {pool}