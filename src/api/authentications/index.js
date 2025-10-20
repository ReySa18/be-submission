import routes from './routes.js';
import AuthenticationsHandler from './handler.js';
import AuthenticationsService from '../../services/AuthenticationsService.js';
import UsersService from '../../services/UsersService.js';
import TokenManager from '../../services/TokenManager.js';

const authenticationsPlugin = (app) => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const tokenManager = new TokenManager();

  const handler = new AuthenticationsHandler(usersService, authenticationsService, tokenManager);

  app.use('/authentications', routes(handler));
};

export default authenticationsPlugin;
