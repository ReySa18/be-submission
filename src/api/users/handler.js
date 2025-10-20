import UsersValidator from '../../validator/users/index.js';
import ClientError from '../../exceptions/ClientError.js';

class UsersHandler {
  constructor(service) {
    this._service = service;
  }

  postUser = async (req, res) => {
    try {
      UsersValidator.validateUserPayload(req.body);
      const userId = await this._service.addUser(req.body);
      return res.status(201).json({
        status: 'success',
        data: { userId },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).json({
          status: 'fail',
          message: error.message,
        });
      }

      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  };
}

export default UsersHandler;
