import express from 'express';

const routes = (handler) => {
  const router = express.Router();
  router.post('/', handler.postAuthentication);
  router.put('/', handler.putAuthentication);
  router.delete('/', handler.deleteAuthentication);

  return router;
};

export default routes;
