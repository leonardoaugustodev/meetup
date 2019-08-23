import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ message: true });
});

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);
module.exports = routes;
