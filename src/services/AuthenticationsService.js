import pool from '../config/db.js';
import InvariantError from '../exceptions/InvariantError.js';

class AuthenticationsService {
  async addRefreshToken(token) {
    await pool.query('INSERT INTO authentications (token) VALUES ($1)', [token]);
  }

  async verifyRefreshToken(token) {
    const result = await pool.query('SELECT token FROM authentications WHERE token = $1', [token]);
    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token) {
    const result = await pool.query('DELETE FROM authentications WHERE token = $1 RETURNING token', [token]);
    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak ditemukan');
    }
  }
}

export default AuthenticationsService;
