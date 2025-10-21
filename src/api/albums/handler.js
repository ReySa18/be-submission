import AlbumsValidator from '../../validator/albums/index.js';
import ClientError from '../../exceptions/ClientError.js';

class AlbumsHandler {
  constructor(service, albumLikesService) {
    this._service = service;
    this._albumLikesService = albumLikesService;
  }

  postAlbum = async (req, res) => {
    try {
      AlbumsValidator.validateAlbumPayload(req.body);
      const { name, year } = req.body;
      const albumId = await this._service.addAlbum({ name, year });

      return res.status(201).json({
        status: 'success',
        data: { albumId },
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

  getAlbumById = async (req, res) => {
    try {
      const { id } = req.params;
      const album = await this._service.getAlbumById(id);
      return res.status(200).json({
        status: 'success',
        data: { album },
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

  putAlbumById = async (req, res) => {
    try {
      AlbumsValidator.validateAlbumPayload(req.body);
      const { id } = req.params;
      await this._service.editAlbumById(id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Album berhasil diperbarui',
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

  deleteAlbumById = async (req, res) => {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);
      return res.status(200).json({
        status: 'success',
        message: 'Album berhasil dihapus',
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

  postAlbumLike = async (req, res) => {
    try {
      const { id: albumId } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ status: 'fail', message: 'Autentikasi diperlukan' });
      }

      await this._albumLikesService.addLike(userId, albumId);

      return res.status(201).json({
        status: 'success',
        message: 'Berhasil menyukai album',
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

  deleteAlbumLike = async (req, res) => {
    try {
      const { id: albumId } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ status: 'fail', message: 'Autentikasi diperlukan' });
      }

      await this._albumLikesService.removeLike(userId, albumId);

      return res.status(200).json({
        status: 'success',
        message: 'Berhasil batal menyukai album',
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

  getAlbumLikes = async (req, res) => {
    try {
      const { id: albumId } = req.params;
      const { likes, source } = await this._albumLikesService.getLikesCount(albumId);

      if (source === 'cache') {
        res.set('X-Data-Source', 'cache');
      }

      return res.status(200).json({
        status: 'success',
        data: { likes },
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
}

export default AlbumsHandler;
