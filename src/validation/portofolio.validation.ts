import Joi from "joi";

export const createPortofolioValidation = Joi.object({
  skill: Joi.string().max(100).required(),
  description: Joi.string().required(),
  societyId: Joi.number().integer().required(),
});

export const updatePortofolioValidation = Joi.object({
  skill: Joi.string().max(100).optional(),
  description: Joi.string().optional(),
  societyId: Joi.number().integer().optional(),
});
