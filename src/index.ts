//import express, { Request, Response } from 'express';
//import bodyParser from 'body-parser';
//import { Pool, PoolClient } from 'pg';
//import dotenv from "dotenv";


//dotenv.config();


//const port = process.env.PORT || 3000;


//const app = express();
//app.use(bodyParser.json());

//// db password is root
//const pool = new Pool({
//  user: 'postgres',
//  host: '127.0.0.1',
//  database: 'bitespeed_db',
//  password: 'root',
//  port: 5432,
//});

//interface Contact {
//  id: number;
//  email: string;
//  phoneNumber: string;
//  linkPrecedence: 'primary' | 'secondary';
//  linkedId?: number;
//}

//app.get('/helloworld', (req: Request, res: Response) =>
//  res.send({ message: 'hello world response from server' })
//);

//app.post('/identify', async (req: Request, res: Response) => {
//  console.log(req.body);
//  const { email, phoneNumber }: { email: string; phoneNumber: string } = req.body;
//  let primaryContact: Contact | null = null;
//  let secondaryContacts: Contact[] = [];

//  console.log(email);
//  console.log(phoneNumber);

//  const client: PoolClient = await pool.connect();

//  try {
//    await client.query('BEGIN');

//    // Search for existing contacts
//    const query = `
//      SELECT * FROM Contact 
//      WHERE email = $1 OR phoneNumber = $2
//    `;
//    const result = await client.query(query, [email, phoneNumber]);

//    if (result.rows.length === 0) {
//      // No existing contacts, create a new primary contact
//      const insertQuery = `
//        INSERT INTO Contact (email, phoneNumber, linkPrecedence) 
//        VALUES ($1, $2, 'primary') 
//        RETURNING *
//      `;
//      const insertResult = await client.query(insertQuery, [email, phoneNumber]);
//      primaryContact = insertResult.rows[0] as Contact;
//    } else {
//      // Existing contacts found
//      for (const row of result.rows) {
//        const contact: Contact = row as Contact;
//        if (contact.linkPrecedence === 'primary') {
//          primaryContact = contact;
//        } else {
//          secondaryContacts.push(contact);
//        }
//      }

//      if (!primaryContact) {
//        primaryContact = secondaryContacts[0];
//        secondaryContacts.shift();
//      }

//      if (email && primaryContact.email !== email) {
//        const insertQuery = `
//          INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) 
//          VALUES ($1, $2, $3, 'secondary') 
//          RETURNING *
//        `;
//        const insertResult = await client.query(insertQuery, [
//          email,
//          phoneNumber,
//          primaryContact.id,
//        ]);
//        secondaryContacts.push(insertResult.rows[0] as Contact);
//      }
//    }

//    await client.query('COMMIT');

//    const response = {
//      contact: {
//        primaryContactId: primaryContact.id,
//        emails: [
//          primaryContact.email,
//          ...secondaryContacts.map((c) => c.email).filter((e) => e),
//        ],
//        phoneNumbers: [
//          primaryContact.phoneNumber,
//          ...secondaryContacts.map((c) => c.phoneNumber).filter((p) => p),
//        ],
//        secondaryContactIds: secondaryContacts.map((c) => c.id),
//      },
//    };

//    res.status(200).json(response);
//  } catch (err) {
//    await client.query('ROLLBACK');
//    console.error(err);
//    res.status(500).send('Internal Server Error');
//  } finally {
//    client.release();
//  }
//});

//app.listen(port, () => {
//  console.log('Server running on port 3000');
//});



import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { pool } from './database/db';
import { setupRoutes } from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
setupRoutes(app);

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
