import { pool } from './db';

const dropContactTable = `
  DROP TABLE IF EXISTS Contact;
`;

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
    // Drop the Contact table if it exists
    await client.query(dropContactTable);
    console.log('Contact table dropped.');

    // Create the Contact table
    await client.query(createContactTable);
    console.log('Contact table created.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
}

initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error initializing database:', err);
    process.exit(1);
  });
