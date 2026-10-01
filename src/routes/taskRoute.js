import controller from '../controllers/taskController.js';
import auth from '../middlewares/auth.js';

export default (app) => {
  app.post('/tasks/persist', auth, controller.persist);
  app.post('/tasks/persist/:id', auth, controller.persist);
  app.delete('/tasks/:id', auth, controller.destroy);
  app.get('/tasks', auth, controller.get);
  app.get('/tasks/:id', auth, controller.get);
};
