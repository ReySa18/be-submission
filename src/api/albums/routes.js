import express from 'express';
import upload from '../../config/multerConfig.js';

const routes = (handler, authenticate) => {
  const router = express.Router();

  router.post('/', handler.postAlbum);
  router.get('/:id', handler.getAlbumById);
  router.put('/:id', handler.putAlbumById);
  router.delete('/:id', handler.deleteAlbumById);

  router.post('/:id/likes', authenticate, handler.postAlbumLike);
  router.delete('/:id/likes', authenticate, handler.deleteAlbumLike);
  router.get('/:id/likes', handler.getAlbumLikes);

  router.post('/:id/covers', upload, handler.uploadAlbumCover);

  return router;
};

export default routes;
