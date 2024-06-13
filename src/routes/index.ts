import { Express } from 'express';
import { contactController } from '../controllers/contactController';

export function setupRoutes(app: Express) {
  app.get('/helloworld', (req, res) => res.send({ message: 'hello world response from server' }));
  app.post('/identify', contactController.identify);
}
