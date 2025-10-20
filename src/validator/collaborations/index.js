import Joi from 'joi';
import InvariantError from '../../exceptions/InvariantError.js';

const CollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const { error } = CollaborationPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

export default CollaborationsValidator;
