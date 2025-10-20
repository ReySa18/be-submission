import routes from './routes.js';
import SongsHandler from './handler.js';
import SongsService from '../../services/songsService.js';

const songsPlugin = (app) => {
  const service = new SongsService();
  const handler = new SongsHandler(service);
  app.use('/songs', routes(handler));
};

export default songsPlugin;
