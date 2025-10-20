import jwt from 'jsonwebtoken';

class TokenManager {
  constructor() {
    this._accessTokenKey = process.env.ACCESS_TOKEN_KEY;
    this._refreshTokenKey = process.env.REFRESH_TOKEN_KEY;
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, this._accessTokenKey, { expiresIn: '15m' });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, this._refreshTokenKey);
  }

  verifyAccessToken(token) {
    return jwt.verify(token, this._accessTokenKey);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, this._refreshTokenKey);
  }
}

export default TokenManager;
