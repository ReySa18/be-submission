import routes from './routes.js';
import PlaylistsHandler from './handler.js';
import PlaylistsService from '../../services/PlaylistsService.js';
import PlaylistActivitiesService from '../../services/PlaylistActivitiesService.js';
import TokenManager from '../../services/TokenManager.js';
import authenticate from '../_middlewares/authenticate.js';

const playlistsPlugin = (app) => {
  const activitiesService = new PlaylistActivitiesService();
  const service = new PlaylistsService(activitiesService);
  const tokenManager = new TokenManager();
  const authMiddleware = authenticate(tokenManager);
  const handler = new PlaylistsHandler(service);

  app.use('/playlists', routes(handler, authMiddleware));
};

export default playlistsPlugin;
