import ClientError from '../../exceptions/ClientError.js';
import CollaborationsValidator from '../../validator/collaborations/index.js';

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;

    this.postCollaboration = this.postCollaboration.bind(this);
    this.deleteCollaboration = this.deleteCollaboration.bind(this);
  }

  async postCollaboration(req, res) {
    try {
      CollaborationsValidator.validateCollaborationPayload(req.body);
      const { playlistId, userId } = req.body;
      const ownerId = req.user.id;

      await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);
      const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

      return res.status(201).json({
        status: 'success',
        data: { collaborationId },
      });
    } catch (error) {
      if (error instanceof ClientError)
        return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      console.error('POST /collaborations error:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  async deleteCollaboration(req, res) {
    try {
      CollaborationsValidator.validateCollaborationPayload(req.body);
      const { playlistId, userId } = req.body;
      const ownerId = req.user.id;

      await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);
      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return res.status(200).json({
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      });
    } catch (error) {
      if (error instanceof ClientError)
        return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      console.error('DELETE /collaborations error:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }
}

export default CollaborationsHandler;
