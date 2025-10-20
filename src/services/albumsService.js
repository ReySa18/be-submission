import { randomUUID } from 'crypto';
import pool from '../config/db.js';
import ClientError from '../exceptions/ClientError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class AlbumsService {
  async addAlbum({ name, year }) {
    const id = `album-${randomUUID()}`;
    const query = {
      text: 'INSERT INTO albums(id, name, year) VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await pool.query(query);
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const result = await pool.query('SELECT * FROM albums WHERE id = $1', [id]);
    if (!result.rows.length) throw new NotFoundError('Album tidak ditemukan');

    const songsResult = await pool.query(
      'SELECT id, title, performer FROM songs WHERE album_id = $1',
      [id],
    );

    const album = {
      ...result.rows[0],
      songs: songsResult.rows,
    };

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const result = await pool.query(
      'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      [name, year, id],
    );
    if (result.rowCount === 0) {
      throw new ClientError('Gagal memperbarui album. Id tidak ditemukan', 404);
    }
    return result.rows[0].id;
  }

  async deleteAlbumById(id) {
    const result = await pool.query('DELETE FROM albums WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      throw new ClientError('Album gagal dihapus. Id tidak ditemukan', 404);
    }
    return result.rows[0].id;
  }
}

export default AlbumsService;
