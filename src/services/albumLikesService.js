import { randomUUID } from 'crypto';
import pool from '../config/db.js';
import ClientError from '../exceptions/ClientError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import { redisClient, connectRedis } from '../config/redis.js';

const CACHE_TTL_SECONDS = 1800;
const CACHE_KEY_PREFIX = 'album_likes:';

class AlbumLikesService {
  constructor() {
    connectRedis().catch(() => {
    });
  }

  async _ensureAlbumExists(albumId) {
    const result = await pool.query('SELECT id FROM albums WHERE id = $1', [albumId]);
    if (!result.rows.length) throw new NotFoundError('Album tidak ditemukan');
  }

  async addLike(userId, albumId) {
    await this._ensureAlbumExists(albumId);

    const checkQuery = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const existingLike = await pool.query(checkQuery);

    if (existingLike.rowCount > 0) {
      throw new ClientError('Anda sudah menyukai album ini', 400);
    }

    const id = `like-${randomUUID()}`;
    const insertQuery = {
      text: 'INSERT INTO user_album_likes(id, user_id, album_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await pool.query(insertQuery);

    try {
      await redisClient.del(`${CACHE_KEY_PREFIX}${albumId}`);
    } catch (e) {
      console.error(`Gagal menghapus cache untuk album ${albumId}:`, e.message);
    }

    return result.rows[0].id;
  }


  async removeLike(userId, albumId) {
    await this._ensureAlbumExists(albumId);

    const result = await pool.query(
      'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      [userId, albumId],
    );

    if (result.rowCount === 0) {
      throw new ClientError('Anda belum menyukai album ini', 400);
    }

    try {
      await redisClient.del(`${CACHE_KEY_PREFIX}${albumId}`);
    } catch (e) {
      console.error('Gagal menghapus like', e.message);
    }

    return result.rows[0].id;
  }

  async getLikesCount(albumId) {
    await this._ensureAlbumExists(albumId);

    const cacheKey = `${CACHE_KEY_PREFIX}${albumId}`;
    try {
      if (redisClient.isOpen) {
        const cached = await redisClient.get(cacheKey);
        if (cached !== null) {
          const count = parseInt(cached, 10);
          return { likes: count, source: 'cache' };
        }
      }
    } catch (err) {
      console.error('Gagal mengambil cache dari Redis:', err.message);
    }

    const result = await pool.query(
      'SELECT COUNT(*)::int AS likes FROM user_album_likes WHERE album_id = $1',
      [albumId],
    );
    const count = result.rows[0]?.likes ?? 0;

    try {
      if (redisClient.isOpen) {
        await redisClient.setEx(cacheKey, CACHE_TTL_SECONDS, String(count));
      }
    } catch (err) {
      console.error('Gagal mengatur cache di Redis:', err.message);
    }

    return { likes: count, source: 'db' };
  }
}

export default AlbumLikesService;
