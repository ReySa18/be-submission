import express from 'express';

const routes = (handler, authenticate) => {
  const router = express.Router();

  router.post('/', authenticate, handler.postCollaboration);
  router.delete('/', authenticate, handler.deleteCollaboration);

  return router;
};

export default routes;
