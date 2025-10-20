import SongsValidator from '../../validator/songs/index.js';
import ClientError from '../../exceptions/ClientError.js';

class SongsHandler {
  constructor(service) {
    this._service = service;
  }

  postSong = async (req, res) => {
    try {
      SongsValidator.validateSongPayload(req.body);
      const songId = await this._service.addSong(req.body);
      return res.status(201).json({
        status: 'success',
        data: { songId },
      });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).json({
          status: 'fail',
          message: error.message,
        });
      }
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
  };

  getSongs = async (req, res, next) => {
    try {
      const { title, performer } = req.query;
      const songs = await this._service.getSongs(title, performer);
      res.status(200).json({
        status: 'success',
        data: { songs },
      });
    } catch (error) {
      next(error);
    }
  };

  getSongById = async (req, res) => {
    try {
      const { id } = req.params;
      const song = await this._service.getSongById(id);
      return res.status(200).json({ status: 'success', data: { song } });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      }
      console.error(error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };

  putSongById = async (req, res) => {
    try {
      SongsValidator.validateSongPayload(req.body);
      const { id } = req.params;
      await this._service.editSongById(id, req.body);
      return res.status(200).json({ status: 'success', message: 'Lagu berhasil diperbarui' });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      }
      console.error(error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };

  deleteSongById = async (req, res) => {
    try {
      const { id } = req.params;
      await this._service.deleteSongById(id);
      return res.status(200).json({ status: 'success', message: 'Lagu berhasil dihapus' });
    } catch (error) {
      if (error instanceof ClientError) {
        return res.status(error.statusCode).json({ status: 'fail', message: error.message });
      }
      console.error(error);
      return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };
}

export default SongsHandler;
