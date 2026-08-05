const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function connectDB() {
  await pool.connect();
  console.log('Connected to PostgreSQL');
}

module.exports = {
  pool,
  connectDB,
};
