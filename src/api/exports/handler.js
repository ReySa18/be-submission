import ClientError from '../../exceptions/ClientError.js';
import ExportValidator from '../../validator/exports/index.js';

class ExportsHandler {
  constructor(playlistsService, producerService) {
    this._playlistsService = playlistsService;
    this._producerService = producerService;

    this.postExportPlaylist = this.postExportPlaylist.bind(this);
  }

  async postExportPlaylist(req, res) {
    try {
      ExportValidator.validateExportPayload(req.body);
      const { targetEmail } = req.body;
      const { id: playlistId } = req.params;
      const ownerId = req.user.id;

      await this._playlistsService.verifyPlaylistOwner(playlistId, ownerId);

      const queueName = process.env.EXPORT_QUEUE_NAME || 'export:playlists';
      await this._producerService.sendToQueue(queueName, {
        playlistId,
        targetEmail,
      });

      return res.status(201).json({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      }
      console.error('POST /export/playlists/:id error:', error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }
}

export default ExportsHandler;
