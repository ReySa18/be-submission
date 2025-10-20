import express from 'express';

const routes = (handler) => {
  const router = express.Router();
  router.post('/', handler.postAlbum);
  router.get('/:id', handler.getAlbumById);
  router.put('/:id', handler.putAlbumById);
  router.delete('/:id', handler.deleteAlbumById);
  return router;
};

export default routes;
