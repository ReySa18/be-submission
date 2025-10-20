import Joi from 'joi';
import ClientError from '../../exceptions/ClientError.js';

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer().optional().allow(null),
  albumId: Joi.string().optional().allow(null, ''),
});

const validateSongPayload = (payload) => {
  const { error } = SongPayloadSchema.validate(payload);
  if (error) {
    throw new ClientError(error.details[0].message, 400);
  }
};

export default { validateSongPayload };
