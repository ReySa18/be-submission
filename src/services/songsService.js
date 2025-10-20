import { randomUUID } from 'crypto';
import pool from '../config/db.js';
import ClientError from '../exceptions/ClientError.js';

class SongsService {
  async addSong({ title, year, performer, genre, duration, albumId }) {
    if (albumId) {
      const a = await pool.query('SELECT id FROM albums WHERE id = $1', [albumId]);
      if (!a.rows.length) {
        throw new ClientError('Album tidak ditemukan', 404);
      }
    }

    const id = `song-${randomUUID()}`;
    const query = {
      text: `INSERT INTO songs(id, title, year, performer, genre, duration, album_id)
             VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      values: [id, title, year, performer, genre, duration ?? null, albumId ?? null],
    };
    const result = await pool.query(query);
    return result.rows[0].id;
  }

  async getSongs(title, performer) {
    let query = 'SELECT id, title, performer FROM songs';
    const conditions = [];
    const values = [];

    if (title) {
      values.push(`%${title}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    if (performer) {
      values.push(`%${performer}%`);
      conditions.push(`performer ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  async getSongById(id) {
    const result = await pool.query(
      `SELECT id, title, year, performer, genre, duration, album_id
       FROM songs WHERE id = $1`,
      [id],
    );
    const song = result.rows[0];
    if (!song) throw new ClientError('Lagu tidak ditemukan', 404);
    return {
      id: song.id,
      title: song.title,
      year: song.year,
      performer: song.performer,
      genre: song.genre,
      duration: song.duration,
      albumId: song.album_id,
    };
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    if (albumId) {
      const a = await pool.query('SELECT id FROM albums WHERE id = $1', [albumId]);
      if (!a.rows.length) {
        throw new ClientError('Album tidak ditemukan', 404);
      }
    }

    const result = await pool.query(
      `UPDATE songs SET title=$1, year=$2, performer=$3, genre=$4, duration=$5, album_id=$6, updated_at=current_timestamp
       WHERE id=$7 RETURNING id`,
      [title, year, performer, genre, duration ?? null, albumId ?? null, id],
    );

    if (result.rowCount === 0) {
      throw new ClientError('Gagal memperbarui lagu. Id tidak ditemukan', 404);
    }
    return result.rows[0].id;
  }

  async deleteSongById(id) {
    const result = await pool.query('DELETE FROM songs WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      throw new ClientError('Lagu gagal dihapus. Id tidak ditemukan', 404);
    }
    return result.rows[0].id;
  }
}

export default SongsService;
