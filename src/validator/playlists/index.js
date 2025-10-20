import Joi from 'joi';
import InvariantError from '../../exceptions/InvariantError.js';

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PostPlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const { error } = PostPlaylistPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },

  validatePostPlaylistSongPayload: (payload) => {
    const { error } = PostPlaylistSongPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

export default PlaylistsValidator;
