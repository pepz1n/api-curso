import controller from '../controllers/userController.js';
import auth from '../middlewares/auth.js';

export default (app) => {
  app.post('/users/persist', controller.persist);
  app.post('/users/login', controller.login);
  app.post('/users/persist/:id', auth, controller.persist);
  app.delete('/users/:id', auth, controller.destroy);
  app.get('/users/me', auth, controller.get);
};
