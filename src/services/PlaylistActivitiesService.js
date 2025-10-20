import { randomUUID } from 'crypto';
import pool from '../config/db.js';

class PlaylistActivitiesService {
  async addActivity({ playlistId, songId, userId, action }) {
    const id = `activity-${randomUUID()}`;
    const query = {
      text: 'INSERT INTO playlist_activities (id, playlist_id, song_id, user_id, action) VALUES ($1, $2, $3, $4, $5)',
      values: [id, playlistId, songId, userId, action],
    };
    await pool.query(query);
  }

  async getActivitiesByPlaylistId(playlistId) {
    const query = {
      text: `
        SELECT u.username, s.title, a.action, a.time
        FROM playlist_activities a
        JOIN users u ON a.user_id = u.id
        JOIN songs s ON a.song_id = s.id
        WHERE a.playlist_id = $1
        ORDER BY a.time ASC
      `,
      values: [playlistId],
    };

    const result = await pool.query(query);
    return result.rows;
  }
}

export default PlaylistActivitiesService;
