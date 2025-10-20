import routes from './routes.js';
import CollaborationsHandler from './handler.js';
import CollaborationsService from '../../services/CollaborationsService.js';
import PlaylistsService from '../../services/PlaylistsService.js';
import TokenManager from '../../services/TokenManager.js';
import authenticate from '../_middlewares/authenticate.js';

const collaborationsPlugin = (app) => {
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService();
  const tokenManager = new TokenManager();
  const authMiddleware = authenticate(tokenManager);

  const handler = new CollaborationsHandler(collaborationsService, playlistsService);

  app.use('/collaborations', routes(handler, authMiddleware));
};

export default collaborationsPlugin;
