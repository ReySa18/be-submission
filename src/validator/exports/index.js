import Joi from 'joi';
import InvariantError from '../../exceptions/InvariantError.js';

const ExportPayloadSchema = Joi.object({
  targetEmail: Joi.string().email().required(),
});

const ExportValidator = {
  validateExportPayload: (payload) => {
    const { error } = ExportPayloadSchema.validate(payload);
    if (error) throw new InvariantError(error.message);
  },
};

export default ExportValidator;
