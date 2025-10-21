import express from 'express';

const routes = (handler, authenticate) => {
  const router = express.Router();
  router.post('/playlists/:id', authenticate, handler.postExportPlaylist);
  return router;
};

export default routes;
