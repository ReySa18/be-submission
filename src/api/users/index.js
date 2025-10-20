import routes from './routes.js';
import UsersHandler from './handler.js';
import UsersService from '../../services/UsersService.js';

const usersPlugin = (app) => {
  const service = new UsersService();
  const handler = new UsersHandler(service);
  app.use('/users', routes(handler));
};

export default usersPlugin;
