import ClientError from '../../exceptions/ClientError.js';

const authenticate = (tokenManager) => (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new ClientError('Missing authentication', 401);

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token)
      throw new ClientError('Invalid authentication scheme', 401);

    const payload = tokenManager.verifyAccessToken(token);

    req.user = { id: payload.userId || payload.userId };

    return next();
  } catch (error) {
    if (error instanceof ClientError) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

export default authenticate;
