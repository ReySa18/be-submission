import express from 'express';

const routes = (handler) => {
  const router = express.Router();

  router.post('/', handler.postUser);

  return router;
};

export default routes;
