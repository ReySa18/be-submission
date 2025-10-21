import routes from './routes.js';
import AlbumsHandler from './handler.js';
import AlbumsService from '../../services/albumsService.js';
import AlbumLikesService from '../../services/albumLikesService.js';
import TokenManager from '../../services/TokenManager.js';
import authenticate from '../_middlewares/authenticate.js';

const albumsPlugin = (app) => {
  const service = new AlbumsService();
  const albumLikesService = new AlbumLikesService();
  const tokenManager = new TokenManager();
  const authMiddleware = authenticate(tokenManager);
  const handler = new AlbumsHandler(service, albumLikesService);
  app.use('/albums', routes(handler, authMiddleware));
};

export default albumsPlugin;
