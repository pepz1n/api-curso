import userRoute from './userRoute.js';
import taskRoute from './taskRoute.js';

function Routes(app) {
  userRoute(app);
  taskRoute(app);
}

export default Routes;
