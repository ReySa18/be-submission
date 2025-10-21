import routes from './routes.js';
import ExportsHandler from './handler.js';
import ProducerService from '../../services/ProducerService.js';
import PlaylistsService from '../../services/PlaylistsService.js';
import PlaylistActivitiesService from '../../services/PlaylistActivitiesService.js';
import TokenManager from '../../services/TokenManager.js';
import authenticate from '../_middlewares/authenticate.js';

const exportsPlugin = (app) => {
  const activitiesService = new PlaylistActivitiesService();
  const playlistsService = new PlaylistsService(activitiesService);
  const producerService = new ProducerService();
  const tokenManager = new TokenManager();
  const authMiddleware = authenticate(tokenManager);
  const handler = new ExportsHandler(playlistsService, producerService);

  app.use('/export', routes(handler, authMiddleware));
};

export default exportsPlugin;
