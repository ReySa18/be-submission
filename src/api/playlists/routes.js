import express from 'express';

const routes = (handler, authenticate) => {
  const router = express.Router();

  router.post('/', authenticate, handler.postPlaylist);
  router.get('/', authenticate, handler.getPlaylists);
  router.delete('/:id', authenticate, handler.deletePlaylist);

  router.post('/:id/songs', authenticate, handler.postSongToPlaylist);
  router.get('/:id/songs', authenticate, handler.getSongsFromPlaylist);
  router.delete('/:id/songs', authenticate, handler.deleteSongFromPlaylist);

  router.get('/:id/activities', authenticate, handler.getPlaylistActivities);

  return router;
};

export default routes;
