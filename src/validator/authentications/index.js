import Joi from 'joi';
import InvariantError from '../../exceptions/InvariantError.js';

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const { error } = PostAuthenticationPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },

  validatePutAuthenticationPayload: (payload) => {
    const { error } = PutAuthenticationPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const { error } = DeleteAuthenticationPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

export default AuthenticationsValidator;
