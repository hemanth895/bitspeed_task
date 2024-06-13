import { pool } from './db';

const createContactTable = `
  CREATE TABLE IF NOT EXISTS Contact (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    phoneNumber VARCHAR(50) UNIQUE,
    linkPrecedence VARCHAR(50) NOT NULL,
    linkedId INTEGER,
    FOREIGN KEY (linkedId) REFERENCES Contact(id)
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
