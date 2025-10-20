import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';
import ClientError from '../exceptions/ClientError.js';
import AuthenticationError from '../exceptions/AuthenticationError.js';

class UsersService {
  async addUser({ username, password, fullname }) {
    const userCheck = await pool.query('SELECT username FROM users WHERE username = $1', [username]);
    if (userCheck.rowCount > 0) {
      throw new ClientError('Username sudah digunakan', 400);
    }

    const id = `user-${randomUUID()}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4) RETURNING id',
      [id, username, hashedPassword, fullname],
    );

    return result.rows[0].id;
  }

  async verifyUserCredential(username, password) {
    const result = await pool.query('SELECT id, password FROM users WHERE username = $1', [username]);
    if (!result.rowCount) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return id;
  }
}

export default UsersService;
