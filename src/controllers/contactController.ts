import { Request, Response } from 'express';
import { pool } from '../database/db';
import { Contact } from '../models/contact';

export const contactController = {
  async identify(req: Request, res: Response) {
    const { email, phoneNumber }: { email: string; phoneNumber: string } = req.body;
    let primaryContact: Contact | null = null;
    let secondaryContacts: Contact[] = [];

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const query = `
        SELECT * FROM Contact 
        WHERE email = $1 OR phoneNumber = $2
      `;
        const result = await client.query(query, [email, phoneNumber]);
        

        //  if no contacts are returned they are considered as primary contacts
        //and we insert into database as primary contact

      if (result.rows.length === 0) {
        const insertQuery = `
          INSERT INTO Contact (email, phoneNumber, linkPrecedence) 
          VALUES ($1, $2, 'primary') 
          RETURNING *
        `;
        const insertResult = await client.query(insertQuery, [email, phoneNumber]);
        primaryContact = insertResult.rows[0] as Contact;
      } else {
        for (const row of result.rows) {
          const contact: Contact = row as Contact;
          if (contact.linkPrecedence === 'primary') {
            primaryContact = contact;
          } else {
            secondaryContacts.push(contact);
          }
        }

        if (!primaryContact) {
          primaryContact = secondaryContacts[0];
          secondaryContacts.shift();
        }

        if (email && primaryContact.email !== email) {
          const insertQuery = `
            INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) 
            VALUES ($1, $2, $3, 'secondary') 
            RETURNING *
          `;
          const insertResult = await client.query(insertQuery, [
            email,
            phoneNumber,
            primaryContact.id,
          ]);
          secondaryContacts.push(insertResult.rows[0] as Contact);
        }
      }

      await client.query('COMMIT');

      const response = {
        contact: {
          primaryContactId: primaryContact.id,
          emails: [
            primaryContact.email,
            ...secondaryContacts.map((c) => c.email).filter((e) => e),
          ],
          phoneNumbers: [
            primaryContact.phoneNumber,
            ...secondaryContacts.map((c) => c.phoneNumber).filter((p) => p),
          ],
          secondaryContactIds: secondaryContacts.map((c) => c.id),
        },
      };

      res.status(200).json(response);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).send('Internal Server Error');
    } finally {
      client.release();
    }
  },
};
