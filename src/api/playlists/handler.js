import PlaylistsValidator from '../../validator/playlists/index.js';
import ClientError from '../../exceptions/ClientError.js';

class PlaylistsHandler {
  constructor(service) {
    this._service = service;
    this.postPlaylist = this.postPlaylist.bind(this);
    this.getPlaylists = this.getPlaylists.bind(this);
    this.deletePlaylist = this.deletePlaylist.bind(this);
    this.postSongToPlaylist = this.postSongToPlaylist.bind(this);
    this.getSongsFromPlaylist = this.getSongsFromPlaylist.bind(this);
    this.deleteSongFromPlaylist = this.deleteSongFromPlaylist.bind(this);
  }

  postPlaylist = async (req, res) => {
    try {
      PlaylistsValidator.validatePostPlaylistPayload(req.body);
      const { name } = req.body;
      const owner = req.user.id;
      const playlistId = await this._service.addPlaylist({ name, owner });
      return res.status(201).json({ status: 'success', data: { playlistId } });
    } catch (error) {
      if (error instanceof ClientError) return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      console.error('POST /playlists error:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };

  getPlaylists = async (req, res) => {
    try {
      const owner = req.user.id;
      const playlists = await this._service.getPlaylistsByOwner(owner);
      return res.status(200).json({ status: 'success', data: { playlists } });
    } catch (error) {
      if (error instanceof ClientError) return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      console.error('GET /playlists error:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };

  getPlaylistActivities = async (req, res) => {
    try {
        const { id: playlistId } = req.params;
        await this._service.verifyPlaylistAccess(playlistId, req.user.id);
        const activities = await this._service._activitiesService.getActivitiesByPlaylistId(playlistId);

        return res.status(200).json({
        status: 'success',
        data: {
            playlistId,
            activities,
        },
        });
    } catch (error) {
        if (error instanceof ClientError)
        return res.status(error.statusCode).json({ status: 'fail', message: error.message });
        console.error('GET /playlists/:id/activities error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
    };


  deletePlaylist = async (req, res) => {
    try {
      const { id } = req.params;
      // ensure owner
      await this._service.verifyPlaylistOwner(id, req.user.id);
      await this._service.deletePlaylist(id);
      return res.status(200).json({ status: 'success', message: 'Playlist berhasil dihapus' });
    } catch (error) {
      if (error instanceof ClientError) return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      console.error('DELETE /playlists/:id error:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };

  postSongToPlaylist = async (req, res) => {
    try {
      PlaylistsValidator.validatePostPlaylistSongPayload(req.body);
      const { songId } = req.body;
      const { id: playlistId } = req.params;
      // verify access (owner or collaborator)
      await this._service.verifyPlaylistAccess(playlistId, req.user.id);
      await this._service.addSongToPlaylist(playlistId, songId, req.user.id);
      return res.status(201).json({ status: 'success', message: 'Lagu berhasil ditambahkan ke playlist' });
    } catch (error) {
      if (error instanceof ClientError) return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      console.error('POST /playlists/:id/songs error:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };

  getSongsFromPlaylist = async (req, res) => {
    try {
      const { id: playlistId } = req.params;
      await this._service.verifyPlaylistAccess(playlistId, req.user.id);
      const playlist = await this._service.getPlaylistSongs(playlistId);
      return res.status(200).json({ status: 'success', data: { playlist } });
    } catch (error) {
      if (error instanceof ClientError) return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      console.error('GET /playlists/:id/songs error:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };

  deleteSongFromPlaylist = async (req, res) => {
    try {
      PlaylistsValidator.validatePostPlaylistSongPayload(req.body);
      const { songId } = req.body;
      const { id: playlistId } = req.params;
      await this._service.verifyPlaylistAccess(playlistId, req.user.id);
      await this._service.deleteSongFromPlaylist(playlistId, songId, req.user.id);
      return res.status(200).json({ status: 'success', message: 'Lagu berhasil dihapus dari playlist' });
    } catch (error) {
      if (error instanceof ClientError) return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      console.error('DELETE /playlists/:id/songs error:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };
}

export default PlaylistsHandler;
