import Joi from "joi";

export const applyPositionSchema = Joi.object({
  availablePositionId: Joi.number().integer().required()
});

export const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid("PENDING", "ACCEPTED", "REJECTED").required()
});
