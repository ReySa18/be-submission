import routes from './routes.js';
import AlbumsHandler from './handler.js';
import AlbumsService from '../../services/albumsService.js';

const albumsPlugin = (app) => {
  const service = new AlbumsService();
  const handler = new AlbumsHandler(service);
  app.use('/albums', routes(handler));
};

export default albumsPlugin;
