import ClientError from '../../exceptions/ClientError.js';
import AuthenticationError from '../../exceptions/AuthenticationError.js';
import AuthenticationsValidator from '../../validator/authentications/index.js';

class AuthenticationsHandler {
  constructor(usersService, authenticationsService, tokenManager) {
    this._usersService = usersService;
    this._authenticationsService = authenticationsService;
    this._tokenManager = tokenManager;
  }

  postAuthentication = async (req, res) => {
    try {
      AuthenticationsValidator.validatePostAuthenticationPayload(req.body);
      const { username, password } = req.body;

      const userId = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ userId });
      const refreshToken = this._tokenManager.generateRefreshToken({ userId });

      await this._authenticationsService.addRefreshToken(refreshToken);

      return res.status(201).json({
        status: 'success',
        data: { accessToken, refreshToken },
      });
    } catch (error) {
      if (error instanceof ClientError || error instanceof AuthenticationError) {
        return res.status(error.statusCode).json({
          status: 'fail',
          message: error.message,
        });
      }
      console.error('POST /authentications error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  };

  putAuthentication = async (req, res) => {
    try {
      AuthenticationsValidator.validatePutAuthenticationPayload(req.body);
      const { refreshToken } = req.body;

      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { userId } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ userId });

      return res.status(200).json({
        status: 'success',
        data: { accessToken },
      });
    } catch (error) {
      if (error instanceof ClientError || error instanceof AuthenticationError) {
        return res.status(error.statusCode).json({
          status: 'fail',
          message: error.message,
        });
      }
      console.error('PUT /authentications error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  };

  deleteAuthentication = async (req, res) => {
    try {
      AuthenticationsValidator.validateDeleteAuthenticationPayload(req.body);
      const { refreshToken } = req.body;

      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return res.status(200).json({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      });
    } catch (error) {
      if (error instanceof ClientError || error instanceof AuthenticationError) {
        return res.status(error.statusCode).json({
          status: 'fail',
          message: error.message,
        });
      }
      console.error('DELETE /authentications error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  };
}

export default AuthenticationsHandler;
