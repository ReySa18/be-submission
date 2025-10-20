import { randomUUID } from 'crypto';
import pool from '../config/db.js';
import InvariantError from '../exceptions/InvariantError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class CollaborationsService {
  async addCollaboration(playlistId, userId) {
    // pastikan user ada
    const userCheck = await pool.query('SELECT id FROM users WHERE id=$1', [userId]);
    if (!userCheck.rowCount) throw new NotFoundError('User tidak ditemukan');

    // pastikan playlist ada
    const playlistCheck = await pool.query('SELECT id FROM playlists WHERE id=$1', [playlistId]);
    if (!playlistCheck.rowCount) throw new NotFoundError('Playlist tidak ditemukan');

    const id = `collab-${randomUUID()}`;
    const result = await pool.query(
      'INSERT INTO collaborations(id, playlist_id, user_id) VALUES($1,$2,$3) RETURNING id',
      [id, playlistId, userId]
    );

    if (!result.rowCount) throw new InvariantError('Kolaborasi gagal ditambahkan');
    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const result = await pool.query(
      'DELETE FROM collaborations WHERE playlist_id=$1 AND user_id=$2 RETURNING id',
      [playlistId, userId]
    );
    if (!result.rowCount) throw new InvariantError('Kolaborasi gagal dihapus');
  }

  async verifyCollaborator(playlistId, userId) {
    const result = await pool.query(
      'SELECT id FROM collaborations WHERE playlist_id=$1 AND user_id=$2',
      [playlistId, userId]
    );
    if (!result.rowCount) throw new InvariantError('Kolaborasi tidak ditemukan');
  }
}

export default CollaborationsService;
