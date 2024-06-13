import { pool } from './db';

const createContactTable = `
 CREATE TABLE IF NOT EXISTS Contact (
  id SERIAL PRIMARY KEY,
  phoneNumber VARCHAR(50),
  email VARCHAR(255),
  linkedId INTEGER REFERENCES Contact(id),
  linkPrecedence VARCHAR(50) NOT NULL CHECK (linkPrecedence IN ('primary', 'secondary')),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);
`;

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(createContactTable);
    console.log('Contact table created or already exists.');
  } catch (err) {
    console.error('Error creating Contact table:', err);
  } finally {
    client.release();
  }
}

initializeDatabase().then(() => {
  console.log('Database initialized');
  process.exit(0);
}).catch((err) => {
  console.error('Error initializing database:', err);
  process.exit(1);
});
