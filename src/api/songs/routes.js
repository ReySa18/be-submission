import express from 'express';

const routes = (handler) => {
  const router = express.Router();
  router.post('/', handler.postSong);
  router.get('/', handler.getSongs);
  router.get('/:id', handler.getSongById);
  router.put('/:id', handler.putSongById);
  router.delete('/:id', handler.deleteSongById);
  return router;
};

export default routes;
