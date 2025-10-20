import { randomUUID } from 'crypto';
import pool from '../config/db.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import AuthorizationError from '../exceptions/AuthorizationError.js';

class PlaylistsService {
    constructor(activitiesService) {
    this._activitiesService = activitiesService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${randomUUID()}`;
    const query = {
      text: 'INSERT INTO playlists(id, name, owner) VALUES($1,$2,$3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await pool.query(query);
    return result.rows[0].id;
  }

  async getPlaylistsByOwner(owner) {
    const result = await pool.query(
      `SELECT p.id, p.name, u.username
       FROM playlists p
       LEFT JOIN users u ON p.owner = u.id
       WHERE p.owner = $1`,
      [owner],
    );
    return result.rows;
  }

  async verifyPlaylistOwner(playlistId, userId) {
    const result = await pool.query('SELECT owner FROM playlists WHERE id = $1', [playlistId]);
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan');
    const owner = result.rows[0].owner;
    if (owner !== userId) throw new AuthorizationError('Anda bukan pemilik playlist ini');
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      const coll = await pool.query(
        'SELECT id FROM collaborations WHERE playlist_id=$1 AND user_id=$2',
        [playlistId, userId],
      );
      if (!coll.rowCount) throw new AuthorizationError('Anda tidak memiliki akses ke playlist ini');
    }
  }

  async deletePlaylist(playlistId) {
    const result = await pool.query('DELETE FROM playlists WHERE id = $1 RETURNING id', [playlistId]);
    if (!result.rowCount) throw new NotFoundError('Gagal menghapus playlist. Id tidak ditemukan');
  }

  async addSongToPlaylist(playlistId, songId, userId) {
    const song = await pool.query('SELECT id FROM songs WHERE id = $1', [songId]);
    if (!song.rowCount) throw new NotFoundError('Lagu tidak ditemukan');

    const id = `playlistsong-${randomUUID()}`;
    await pool.query(
        'INSERT INTO playlistsongs(id, playlist_id, song_id) VALUES($1,$2,$3)',
        [id, playlistId, songId]
    );

    await this._activitiesService.addActivity({
        playlistId,
        songId,
        userId,
        action: 'add',
    });
  }

  async getPlaylistSongs(playlistId) {
    const result = await pool.query(
      `SELECT p.id, p.name, u.username
       FROM playlists p
       LEFT JOIN users u ON p.owner = u.id
       WHERE p.id = $1`,
      [playlistId],
    );
    if (!result.rowCount) throw new NotFoundError('Playlist tidak ditemukan');
    const playlist = result.rows[0];

    const songsRes = await pool.query(
      `SELECT s.id, s.title, s.performer
       FROM playlistsongs ps
       JOIN songs s ON ps.song_id = s.id
       WHERE ps.playlist_id = $1`,
      [playlistId],
    );

    return {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs: songsRes.rows,
    };
  }

  async getPlaylistsByOwner(owner) {
    const result = await pool.query(
        `SELECT p.id, p.name, u.username
        FROM playlists p
        LEFT JOIN users u ON p.owner = u.id
        LEFT JOIN collaborations c ON p.id = c.playlist_id
        WHERE p.owner = $1 OR c.user_id = $1
        GROUP BY p.id, u.username`,
        [owner],
    );
    return result.rows;
    }


  async deleteSongFromPlaylist(playlistId, songId, userId) {
    const result = await pool.query(
        'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
        [playlistId, songId]
    );
    if (!result.rowCount) throw new NotFoundError('Lagu tidak ditemukan di playlist');

    await this._activitiesService.addActivity({
        playlistId,
        songId,
        userId,
        action: 'delete',
    });
    }

  async getPlaylistActivities(playlistId) {
    return this._activitiesService.getActivitiesByPlaylistId(playlistId);
  }

}

export default PlaylistsService;
