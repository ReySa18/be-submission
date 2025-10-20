import Joi from 'joi';
import ClientError from '../../exceptions/ClientError.js';

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().required(),
});

const validateAlbumPayload = (payload) => {
  const { error } = AlbumPayloadSchema.validate(payload);
  if (error) {
    throw new ClientError(error.details[0].message, 400);
  }
};

export default { validateAlbumPayload };
